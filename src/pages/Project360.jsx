import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  FileText, 
  Layers, 
  CheckSquare, 
  FileCheck2, 
  AlertTriangle, 
  FolderOpen, 
  History, 
  Sparkles,
  User,
  Activity,
  ArrowLeft
} from "lucide-react";
import { useProject } from "../hooks/useProject";
import { useAuth } from "../hooks/useAuth";
import StatusBadge from "../components/ui/StatusBadge";
import RoleBadge from "../components/ui/RoleBadge";
import LoadingState from "../components/ui/LoadingState";
import { formatUSD, formatDate } from "../utils/formatters";

// Tab imports / UI
import ActionStatus from "../components/ui/ActionStatus";
import ApprovalStatus from "../components/ui/ApprovalStatus";
import AuditTrail from "../components/ui/AuditTrail";
import FileUploader from "../components/ui/FileUploader";

// Services for mutations
import { createActionItem, completeActionItem } from "../services/actionService";
import { approve, reject, requestApproval } from "../services/approvalService";
import { createRisk } from "../services/riskService";
import { registerDocumentMetadata } from "../services/documentService";
import { changeProjectStatus } from "../services/projectService";
import { improveText, suggestActions, generateRisks, summarizeProject } from "../services/aiService";

export function Project360() {
  const { id } = useParams();
  const { user, profile, hasPermission } = useAuth();
  const {
    project,
    investmentRequest,
    adp,
    actions,
    approvals,
    risks,
    documents,
    auditLogs,
    loading,
    error,
    refresh
  } = useProject(id);

  const [activeTab, setActiveTab] = useState("general");
  const [actionTitle, setActionTitle] = useState("");
  const [actionResp, setActionResp] = useState("usr-maint");
  const [submitting, setSubmitting] = useState(false);
  
  // AI State
  const [aiOutput, setAiOutput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  if (loading) {
    return <LoadingState message="Cargando expediente digital 360°..." />;
  }

  if (error || !project) {
    return (
      <div className="text-center py-12 space-y-4">
        <h3 className="text-lg font-bold text-industrial-900 font-heading">Error al cargar</h3>
        <p className="text-sm text-industrial-500">{error || "El expediente solicitado no existe."}</p>
        <Link to="/portfolio" className="text-xs text-brand-600 hover:underline">Volver al Portafolio</Link>
      </div>
    );
  }

  // Mutators
  const handleAddAction = async (e) => {
    e.preventDefault();
    if (!actionTitle) return;
    setSubmitting(true);
    try {
      await createActionItem({
        projectId: id,
        sourceModule: "PROJECT",
        title: actionTitle,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        responsibleUserId: actionResp
      }, user.uid);
      setActionTitle("");
      refresh();
    } catch (err) {
      alert("Error al añadir tarea: " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCompleteAction = async (actionId) => {
    setSubmitting(true);
    try {
      await completeActionItem(actionId, null, user.uid);
      refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleActionApproval = async (approvalId, isApprove) => {
    setSubmitting(true);
    const comments = prompt("Comentarios (opcional):") || "";
    try {
      if (isApprove) {
        await approve(approvalId, comments, user.uid);
      } else {
        await reject(approvalId, comments, user.uid);
      }
      refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMockUpload = async (file) => {
    setSubmitting(true);
    try {
      // Mock upload mapping to documents collection
      await registerDocumentMetadata({
        projectId: id,
        documentType: "Evidencia",
        fileName: file.name,
        fileUrl: "https://mockstorage.styropek.com/o/" + file.name,
        storagePath: `projects/${id}/documents/${file.name}`,
        fileExtension: file.name.split(".").pop(),
        fileSize: file.size,
        status: "Approved",
        tags: ["Carga Manual"]
      }, user.uid);
      refresh();
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRequestApproval = async () => {
    setSubmitting(true);
    try {
      await requestApproval({
        projectId: id,
        module: "ADP",
        documentId: adp?.adpId || "adp-doc-id",
        approverId: "usr-director",
        approverRole: "Dirección"
      }, user.uid);
      
      // Update status
      await changeProjectStatus(id, "Pending Approval", "ADP-02", user.uid);
      refresh();
      alert("Solicitud de aprobación enviada con éxito a la Dirección.");
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // AI Actions
  const runAIImprove = async () => {
    if (!investmentRequest) return;
    setAiLoading(true);
    setAiOutput("");
    try {
      const out = await improveText(investmentRequest.background);
      setAiOutput(out);
    } catch (err) {
      alert(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const runAISuggestActions = async () => {
    setAiLoading(true);
    setAiOutput("");
    try {
      const out = await suggestActions(project);
      setAiOutput(out);
    } catch (err) {
      alert(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const runAIGenerateRisks = async () => {
    setAiLoading(true);
    setAiOutput("");
    try {
      const out = await generateRisks(project.description);
      setAiOutput(out);
    } catch (err) {
      alert(err.message);
    } finally {
      setAiLoading(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: <Activity className="w-4 h-4" /> },
    { id: "request", label: "Sol. Inversión", icon: <FileText className="w-4 h-4" /> },
    { id: "adp", label: "ADP", icon: <Layers className="w-4 h-4" /> },
    { id: "actions", label: "Tareas", icon: <CheckSquare className="w-4 h-4" /> },
    { id: "approvals", label: "Aprobaciones", icon: <FileCheck2 className="w-4 h-4" /> },
    { id: "risks", label: "Riesgos", icon: <AlertTriangle className="w-4 h-4" /> },
    { id: "documents", label: "Documentos", icon: <FolderOpen className="w-4 h-4" /> },
    { id: "audit", label: "Auditoría", icon: <History className="w-4 h-4" /> },
    { id: "ai", label: "IA Copilot", icon: <Sparkles className="w-4 h-4 text-amber-500" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Back button & Title header */}
      <div className="flex items-center gap-3">
        <Link to="/portfolio" className="p-2 rounded-lg bg-white border border-industrial-200 text-industrial-500 hover:text-industrial-800 transition-smooth">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-industrial-400">{project.projectCode}</span>
            <StatusBadge status={project.status} />
          </div>
          <h1 className="text-2xl font-bold text-industrial-950 font-heading tracking-tight mt-0.5">
            {project.projectName}
          </h1>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-industrial-200 overflow-x-auto gap-2 scrollbar-none">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-smooth ${
              activeTab === t.id 
                ? "border-brand-600 text-brand-700 font-bold" 
                : "border-transparent text-industrial-500 hover:text-industrial-800 hover:border-industrial-300"
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panel */}
      <div className="mt-4">
        {/* Tab 1: General Info */}
        {activeTab === "general" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <div className="glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-4">
                <h3 className="text-base font-bold text-industrial-950 font-heading">Descripción</h3>
                <p className="text-sm text-industrial-600 leading-relaxed font-sans">{project.description}</p>
              </div>

              <div className="glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-4">
                <h3 className="text-base font-bold text-industrial-950 font-heading">Hitos & Tiempos</h3>
                <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                  <div>
                    <span className="text-industrial-400 font-medium block">Fecha Inicio Estimada</span>
                    <span className="text-sm font-semibold text-industrial-800 mt-1 block">{formatDate(project.estimatedStartDate)}</span>
                  </div>
                  <div>
                    <span className="text-industrial-400 font-medium block">Fecha Término Estimada</span>
                    <span className="text-sm font-semibold text-industrial-800 mt-1 block">{formatDate(project.estimatedEndDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-4">
                <h3 className="text-base font-bold text-industrial-950 font-heading">Metadatos CAPEX</h3>
                
                <div className="space-y-3 text-xs font-sans border-b border-industrial-100 pb-4">
                  <div className="flex justify-between">
                    <span className="text-industrial-400">Planta</span>
                    <span className="font-semibold text-industrial-800">{project.plantId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-industrial-400">Área</span>
                    <span className="font-semibold text-industrial-800">{project.areaId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-industrial-400">Tipo de Inversión</span>
                    <span className="font-semibold text-industrial-800">{project.investmentType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-industrial-400">Tipo de Proyecto</span>
                    <span className="font-semibold text-industrial-800">{project.projectTypeId}</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs font-sans">
                  <div className="flex justify-between">
                    <span className="text-industrial-400">Presupuesto</span>
                    <span className="font-bold text-industrial-900">{formatUSD(project.estimatedBudgetUSD)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-industrial-400">Ejecutado</span>
                    <span className="font-bold text-industrial-900">{formatUSD(project.spentAmountUSD)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Investment Request */}
        {activeTab === "request" && (
          <div className="glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-6">
            <div className="flex justify-between items-start border-b border-industrial-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-industrial-950 font-heading">
                  Solicitud de Inversión Asociada
                </h3>
                <p className="text-xs text-industrial-400 mt-1">Este expediente representa la etapa preliminar del proyecto.</p>
              </div>
              <button
                onClick={runAIImprove}
                disabled={aiLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 border border-brand-200 text-brand-700 font-semibold rounded-lg text-xs hover:bg-brand-100 transition-smooth"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Optimizar con IA
              </button>
            </div>

            {investmentRequest ? (
              <div className="space-y-5 font-sans">
                <div>
                  <h4 className="text-xs font-bold text-industrial-500 uppercase tracking-wider">Antecedente / Problema</h4>
                  <p className="text-sm text-industrial-800 mt-1.5 leading-relaxed">{investmentRequest.background}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-industrial-500 uppercase tracking-wider">Alcance Operativo</h4>
                  <p className="text-sm text-industrial-800 mt-1.5 leading-relaxed">{investmentRequest.scopeDescription}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div>
                    <h4 className="text-xs font-bold text-industrial-500 uppercase tracking-wider">Objetivos del Proyecto</h4>
                    <p className="text-sm text-industrial-800 mt-1.5 leading-relaxed whitespace-pre-line">{investmentRequest.objectives}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-industrial-500 uppercase tracking-wider">Beneficios Esperados</h4>
                    <p className="text-sm text-industrial-800 mt-1.5 leading-relaxed whitespace-pre-line">{investmentRequest.expectedBenefits}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-industrial-500">
                Cargando solicitud de inversión asociada...
              </div>
            )}

            {aiOutput && (
              <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl space-y-2 mt-4 font-sans text-xs">
                <span className="font-bold text-brand-800 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Propuesta de Texto Optimizado
                </span>
                <p className="text-industrial-700 whitespace-pre-line">{aiOutput}</p>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: ADP */}
        {activeTab === "adp" && (
          <div className="glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-6">
            <div className="flex justify-between items-start border-b border-industrial-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-industrial-950 font-heading">
                  ADP — Aprobación de Detalle del Proyecto
                </h3>
                <p className="text-xs text-industrial-400 mt-1">Hitos técnicos, variables críticas e ingenierías.</p>
              </div>
              
              {!adp ? (
                <Link to={`/project/${id}/adp`}>
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs shadow-md transition-smooth">
                    Generar ADP
                  </button>
                </Link>
              ) : (
                <Link to={`/project/${id}/adp`}>
                  <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs shadow-md transition-smooth">
                    Editar ADP
                  </button>
                </Link>
              )}
            </div>

            {adp ? (
              <div className="space-y-6 font-sans">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-industrial-50 p-4 rounded-xl text-xs border border-industrial-200">
                  <div>
                    <span className="text-industrial-400">Versión</span>
                    <span className="font-bold text-industrial-800 block mt-0.5">V{adp.version}</span>
                  </div>
                  <div>
                    <span className="text-industrial-400">Estado</span>
                    <span className="font-bold text-industrial-800 block mt-0.5">{adp.status}</span>
                  </div>
                  <div>
                    <span className="text-industrial-400">Duración Estimada</span>
                    <span className="font-bold text-industrial-800 block mt-0.5">{adp.estimatedDurationMonths} Meses</span>
                  </div>
                  <div>
                    <span className="text-industrial-400">Aprobación</span>
                    <span className="font-bold text-industrial-800 block mt-0.5">{adp.approvedAt ? formatDate(adp.approvedAt) : "Pendiente"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-industrial-500 uppercase">Hito de Seguridad 1 & 2</h4>
                      <p className="text-sm text-industrial-800 mt-1">
                        {adp.requiresSafetyReview1And2 ? `Requerido. Motivo: ${adp.safetyReviewReason || "Evaluación de proceso"}` : "No Aplica"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-industrial-500 uppercase">PSSR (Pre-Start Safety Review)</h4>
                      <p className="text-sm text-industrial-800 mt-1">
                        {adp.requiresPSSR ? `Requerido. Motivo: ${adp.pssrReason || "Puesta en marcha de equipos"}` : "No Aplica"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-industrial-500 uppercase">MOC Operativo</h4>
                      <p className="text-sm text-industrial-800 mt-1">
                        {adp.requiresMOCOperational ? `Requerido. Motivo: ${adp.mocOperationalReason || "Modificación de líneas"}` : "No Aplica"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-industrial-500 uppercase">Ingeniería Básica</h4>
                      <p className="text-sm text-industrial-800 mt-1">
                        {adp.requiresBasicEngineering ? "Requerida" : "No Requerida"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-sm text-industrial-500">
                Este proyecto de TI no requiere ADP técnica o aún no ha sido cargada.
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Tareas (Actions) */}
        {activeTab === "actions" && (
          <div className="space-y-6">
            {/* Create Action form */}
            {hasPermission("canManageActions") && (
              <form onSubmit={handleAddAction} className="glass-panel p-5 rounded-2xl bg-white shadow-sm flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-industrial-500 mb-1.5 uppercase">
                    Añadir Nueva Acción / Tarea
                  </label>
                  <input
                    type="text"
                    required
                    value={actionTitle}
                    onChange={(e) => setActionTitle(e.target.value)}
                    placeholder="Ej. Cargar dictamen de tierras físicas MASH"
                    className="w-full text-sm border border-industrial-250/80 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-brand-500 focus:outline-none bg-industrial-50/20"
                  />
                </div>
                
                <div className="w-full md:w-48">
                  <label className="block text-xs font-semibold text-industrial-500 mb-1.5 uppercase">
                    Responsable
                  </label>
                  <select
                    value={actionResp}
                    onChange={(e) => setActionResp(e.target.value)}
                    className="w-full text-sm border border-industrial-250/80 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-brand-500 focus:outline-none bg-industrial-50/20"
                  >
                    <option value="usr-leader">Líder (Carlos Mendoza)</option>
                    <option value="usr-maint">Mantenimiento (Daniel Torres)</option>
                    <option value="usr-mash">MASH (Roberto Martínez)</option>
                  </select>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full md:w-auto px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-smooth"
                >
                  Agregar Tarea
                </button>
              </form>
            )}

            <div className="glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-4">
              <h3 className="text-base font-bold text-industrial-950 font-heading">Listado de Pendientes</h3>
              <ActionStatus
                actions={actions}
                onComplete={handleCompleteAction}
                currentUserId={user.uid}
              />
            </div>
          </div>
        )}

        {/* Tab 5: Approvals */}
        {activeTab === "approvals" && (
          <div className="glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-4">
            <h3 className="text-base font-bold text-industrial-950 font-heading">Historial de Aprobaciones</h3>
            <ApprovalStatus
              approvals={approvals}
              onApprove={(appId) => handleActionApproval(appId, true)}
              onReject={(appId) => handleActionApproval(appId, false)}
              currentUserId={user.uid}
            />
          </div>
        )}

        {/* Tab 6: Risks */}
        {activeTab === "risks" && (
          <div className="glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-6">
            <h3 className="text-base font-bold text-industrial-950 font-heading">Matriz de Riesgos Inicial</h3>
            
            {risks.length === 0 ? (
              <div className="text-center p-4 bg-industrial-100/40 rounded-lg text-sm text-industrial-500">
                Ningún riesgo crítico documentado.
              </div>
            ) : (
              <div className="space-y-4 font-sans text-xs">
                {risks.map(risk => (
                  <div key={risk.riskId} className="p-4 border border-industrial-200 rounded-xl bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-industrial-900">{risk.riskCategory}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          risk.riskLevel === "High" ? "bg-red-50 text-red-700 border border-red-200" : "bg-amber-50 text-amber-700 border border-amber-250"
                        }`}>
                          Riesgo {risk.riskLevel}
                        </span>
                      </div>
                      <p className="text-industrial-600 mt-1 leading-relaxed">{risk.description}</p>
                      <p className="text-industrial-500 mt-2"><span className="font-semibold">Mitigación:</span> {risk.mitigationPlan}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 7: Documents */}
        {activeTab === "documents" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-4">
              <h3 className="text-base font-bold text-industrial-950 font-heading">Archivos del Expediente</h3>
              
              {documents.length === 0 ? (
                <div className="text-center p-6 bg-industrial-100/40 rounded-lg text-sm text-industrial-500">
                  Ningún archivo subido.
                </div>
              ) : (
                <div className="divide-y divide-industrial-100 font-sans text-xs">
                  {documents.map(doc => (
                    <div key={doc.documentId} className="py-3 flex justify-between items-center gap-4">
                      <div>
                        <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="font-semibold text-brand-600 hover:underline">
                          {doc.fileName}
                        </a>
                        <p className="text-industrial-450 mt-0.5">
                          Tipo: {doc.documentType} • Subido por: {doc.uploadedBy.replace("usr-", "")}
                        </p>
                      </div>
                      <span className="text-[10px] bg-industrial-100 text-industrial-600 px-2 py-0.5 rounded border border-industrial-200">
                        .{doc.fileExtension.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-4">
              <h3 className="text-base font-bold text-industrial-950 font-heading">Subir Evidencia / Planos</h3>
              <FileUploader onUpload={handleMockUpload} loading={submitting} />
            </div>
          </div>
        )}

        {/* Tab 8: Audit Trail */}
        {activeTab === "audit" && (
          <div className="glass-panel p-6 rounded-2xl bg-white shadow-sm">
            <h3 className="text-base font-bold text-industrial-950 font-heading mb-6">Bitácora Inmutable (Audit Trail)</h3>
            <AuditTrail logs={auditLogs} />
          </div>
        )}

        {/* Tab 9: AI Copilot */}
        {activeTab === "ai" && (
          <div className="glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold text-industrial-950 font-heading flex items-center gap-1.5">
                <Sparkles className="w-5 h-5 text-amber-500" />
                Copiloto de Proyectos CAPEX
              </h3>
              <p className="text-xs text-industrial-400 mt-1">Genera borradores y automatiza revisiones usando IA generativa.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={runAISuggestActions}
                disabled={aiLoading}
                className="p-3 border border-industrial-200 rounded-xl hover:border-brand-300 hover:bg-brand-50/20 text-left transition-smooth text-xs"
              >
                <span className="font-semibold text-industrial-900 block mb-1">Sugerir Acciones</span>
                Recomienda tareas específicas para la etapa {project.currentStage}.
              </button>
              
              <button
                onClick={runAIGenerateRisks}
                disabled={aiLoading}
                className="p-3 border border-industrial-200 rounded-xl hover:border-brand-300 hover:bg-brand-50/20 text-left transition-smooth text-xs"
              >
                <span className="font-semibold text-industrial-900 block mb-1">Mapear Riesgos</span>
                Identifica fallas operativas o riesgos MASH del proyecto.
              </button>
              
              <button
                onClick={async () => {
                  setAiLoading(true);
                  setAiOutput("");
                  try {
                    const out = await summarizeProject(project);
                    setAiOutput(out);
                  } catch (err) {
                    alert(err.message);
                  } finally {
                    setAiLoading(false);
                  }
                }}
                disabled={aiLoading}
                className="p-3 border border-industrial-200 rounded-xl hover:border-brand-300 hover:bg-brand-50/20 text-left transition-smooth text-xs"
              >
                <span className="font-semibold text-industrial-900 block mb-1">Resumen Ejecutivo</span>
                Genera un informe rápido del estado financiero y técnico.
              </button>
            </div>

            {aiLoading && (
              <div className="p-8 border border-dashed border-industrial-200 rounded-xl flex items-center justify-center">
                <LoadingState message="Consultando copiloto IA de proyectos..." />
              </div>
            )}

            {aiOutput && !aiLoading && (
              <div className="p-5 bg-brand-50 border border-brand-200 rounded-xl font-sans text-xs space-y-2">
                <span className="font-bold text-brand-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Recomendación Generada
                </span>
                <p className="text-industrial-700 whitespace-pre-line leading-relaxed">{aiOutput}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default Project360;
