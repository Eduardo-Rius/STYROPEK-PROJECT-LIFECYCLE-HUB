import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProject } from "../hooks/useProject";
import { useAuth } from "../hooks/useAuth";
import { getInvestmentRequestByProject } from "../services/investmentRequestService";
import { changeProjectStatus } from "../services/projectService";
import { createAuditLog } from "../services/auditService";

import { createADP } from "../services/adpService";
import ValidationBanner from "../components/common/ValidationBanner";
import SectionCard from "../components/common/SectionCard";
import FormStepper from "../components/common/FormStepper";

export default function ADPForm() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { project, refresh } = useProject(projectId);
  const adp = project?.adp;

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  // Form fields – pre‑populate if an ADP already exists
  const [version, setVersion] = useState(1);
  const [estimatedDurationMonths, setEstimatedDurationMonths] = useState("");
  const [requiresSafetyReview1And2, setRequiresSafetyReview1And2] = useState(false);
  const [safetyReviewReason, setSafetyReviewReason] = useState("");
  const [requiresPSSR, setRequiresPSSR] = useState(false);
  const [pssrReason, setPssrReason] = useState("");
  const [requiresMOCOperational, setRequiresMOCOperational] = useState(false);
  const [mocOperationalReason, setMocOperationalReason] = useState("");
  const [requiresBasicEngineering, setRequiresBasicEngineering] = useState(false);

  // Load existing ADP if present (edit mode)
  useEffect(() => {
    if (project && project.adp) {
      const a = project.adp;
      setVersion(a.version || 1);
      setEstimatedDurationMonths(a.estimatedDurationMonths || "");
      setRequiresSafetyReview1And2(a.requiresSafetyReview1And2 || false);
      setSafetyReviewReason(a.safetyReviewReason || "");
      setRequiresPSSR(a.requiresPSSR || false);
      setPssrReason(a.pssrReason || "");
      setRequiresMOCOperational(a.requiresMOCOperational || false);
      setMocOperationalReason(a.mocOperationalReason || "");
      setRequiresBasicEngineering(a.requiresBasicEngineering || false);
    }
  }, [project]);

  const validate = async () => {
    const msgs = [];
    // Basic field validation
    if (!estimatedDurationMonths) msgs.push("Duración estimada es requerida.");
    // Project existence & required fields
    if (!project) {
      msgs.push("Proyecto no encontrado.");
    } else {
      if (!project.projectLeaderId) msgs.push("El proyecto debe tener un Líder asignado.");
      if (!project.estimatedBudgetUSD || Number(project.estimatedBudgetUSD) <= 0) msgs.push("El proyecto debe tener un presupuesto estimado mayor a 0.");
    }
    // Investment Request existence
    const invReq = await getInvestmentRequestByProject(projectId);
    if (!invReq) msgs.push("Solicitud de Inversión no encontrada.");
    return msgs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    const validation = await validate();
    if (validation.length) {
      setErrors(validation);
      setLoading(false);
      return;
    }
    try {
      const adpData = {
        projectId,
        version,
        estimatedDurationMonths: Number(estimatedDurationMonths),
        requiresSafetyReview1And2,
        safetyReviewReason: requiresSafetyReview1And2 ? safetyReviewReason : "",
        requiresPSSR,
        pssrReason: requiresPSSR ? pssrReason : "",
        requiresMOCOperational,
        mocOperationalReason: requiresMOCOperational ? mocOperationalReason : "",
        requiresBasicEngineering,
        status: "Draft",
        createdBy: user.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await createADP(adpData, user.uid);
      // Update project stage to ADP
      await changeProjectStatus(projectId, project.status, "ADP", user.uid);
      // Create explicit audit log for stage update
      await createAuditLog({
        projectId,
        userId: user.uid,
        action: "PROJECT_STAGE_UPDATED",
        module: "PROJECT",
        newValue: { currentStage: "ADP" }
      });
      await refresh();
      navigate(`/project/${projectId}`);
    } catch (err) {
      console.error(err);
      setErrors([err.message]);
    } finally {
      setLoading(false);
    }
  };

  // Simple step titles – can be expanded later
  const steps = ["Datos Básicos", "Revisiones", "Resumen"];
  const currentStep = 0; // For now we show a single page; keep UI consistent

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <SectionCard title="Generar / Editar ADP" description="Complete los campos y guarde el ADP del proyecto.">
        {errors.length > 0 && <ValidationBanner messages={errors} />}
        <FormStepper steps={steps} currentStep={currentStep} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-industrial-700 mb-1">Versión</label>
              <input
                type="number"
                min="1"
                value={version}
                onChange={(e) => setVersion(Number(e.target.value))}
                className="w-full rounded-md border border-industrial-200 p-2 focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-industrial-700 mb-1">Duración Estimada (meses)</label>
              <input
                type="number"
                min="1"
                value={estimatedDurationMonths}
                onChange={(e) => setEstimatedDurationMonths(e.target.value)}
                className="w-full rounded-md border border-industrial-200 p-2 focus:outline-none focus:ring-1 focus:ring-brand-500"
                required
              />
            </div>
          </div>

          {/* Safety Review */}
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={requiresSafetyReview1And2}
                onChange={(e) => setRequiresSafetyReview1And2(e.target.checked)}
                className="form-checkbox h-4 w-4 text-brand-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-industrial-700">Requiere Revisión de Seguridad 1 & 2</span>
            </label>
            {requiresSafetyReview1And2 && (
              <input
                type="text"
                placeholder="Motivo de la revisión"
                value={safetyReviewReason}
                onChange={(e) => setSafetyReviewReason(e.target.value)}
                className="w-full rounded-md border border-industrial-200 p-2"
              />
            )}
          </div>

          {/* PSSR */}
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={requiresPSSR}
                onChange={(e) => setRequiresPSSR(e.target.checked)}
                className="form-checkbox h-4 w-4 text-brand-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-industrial-700">Requiere PSSR (Pre‑Start Safety Review)</span>
            </label>
            {requiresPSSR && (
              <input
                type="text"
                placeholder="Motivo de la PSSR"
                value={pssrReason}
                onChange={(e) => setPssrReason(e.target.value)}
                className="w-full rounded-md border border-industrial-200 p-2"
              />
            )}
          </div>

          {/* MOC Operativo */}
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={requiresMOCOperational}
                onChange={(e) => setRequiresMOCOperational(e.target.checked)}
                className="form-checkbox h-4 w-4 text-brand-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-industrial-700">Requiere MOC Operativo</span>
            </label>
            {requiresMOCOperational && (
              <input
                type="text"
                placeholder="Motivo del MOC"
                value={mocOperationalReason}
                onChange={(e) => setMocOperationalReason(e.target.value)}
                className="w-full rounded-md border border-industrial-200 p-2"
              />
            )}
          </div>

          {/* Ingeniería Básica */}
          <div className="space-y-2">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={requiresBasicEngineering}
                onChange={(e) => setRequiresBasicEngineering(e.target.checked)}
                className="form-checkbox h-4 w-4 text-brand-600 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-industrial-700">Requiere Ingeniería Básica</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs shadow-md transition-smooth"
          >
            {loading ? "Guardando…" : adp ? "Actualizar ADP" : "Crear ADP"}
          </button>
        </form>
      </SectionCard>
    </div>
  );
}
