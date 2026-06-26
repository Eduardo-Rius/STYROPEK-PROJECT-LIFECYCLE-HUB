import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, X, Sparkles, AlertTriangle, CheckSquare, FileText } from "lucide-react";

const datasets = {
  "proj-contractor-dining": [
    {
      id: "wbs-1", wbsLevel: "1.0", stage: "Inicio", isStage: true, expanded: true,
      children: [
        { id: "wbs-1-1", wbsLevel: "1.1", stage: "Inicio", discipline: "General", activity: "Kick-off Comedor", responsible: "Líder de Proyecto", startDate: "2024-01-10", endDate: "2024-01-10", duration: "1 d", progress: 100, status: "Terminada", observations: "Acta firmada" },
        { id: "wbs-1-2", wbsLevel: "1.2", stage: "Inicio", discipline: "General", activity: "Aprobación de Presupuesto", responsible: "Dirección", startDate: "2024-01-15", endDate: "2024-02-15", duration: "30 d", progress: 100, status: "Terminada", observations: "Liberado" }
      ]
    },
    {
      id: "wbs-2", wbsLevel: "2.0", stage: "Ingeniería", isStage: true, expanded: true,
      children: [
        { id: "wbs-2-1", wbsLevel: "2.1", stage: "Ingeniería", discipline: "Arquitectura", activity: "Diseño Arquitectónico", responsible: "Carlos Mendoza", startDate: "2024-03-01", endDate: "2024-04-15", duration: "45 d", progress: 100, status: "Terminada", observations: "Aprobado" },
        { id: "wbs-2-2", wbsLevel: "2.2", stage: "Ingeniería", discipline: "Civil", activity: "Ingeniería Estructural", responsible: "Daniel Torres", startDate: "2024-04-16", endDate: "2024-06-30", duration: "75 d", progress: 60, status: "En Proceso", observations: "En revisión" }
      ]
    },
    {
      id: "wbs-3", wbsLevel: "3.0", stage: "Procura", isStage: true, expanded: true,
      children: [
        { id: "wbs-3-1", wbsLevel: "3.1", stage: "Procura", discipline: "Procura", activity: "Mobiliario Inoxidable", responsible: "María Fernanda", startDate: "2024-05-15", endDate: "2024-08-30", duration: "105 d", progress: 25, status: "En Riesgo", observations: "Proveedor demorado" }
      ]
    },
    {
      id: "wbs-4", wbsLevel: "4.0", stage: "Ejecución", isStage: true, expanded: true,
      children: [
        { id: "wbs-4-1", wbsLevel: "4.1", stage: "Ejecución", discipline: "Civil", activity: "Cimentación y Firme", responsible: "Contratista A", startDate: "2024-06-01", endDate: "2024-07-30", duration: "60 d", progress: 10, status: "En Proceso", observations: "Lluvias" }
      ]
    },
    {
      id: "wbs-5", wbsLevel: "5.0", stage: "Cierre", isStage: true, expanded: false,
      children: [
        { id: "wbs-5-1", wbsLevel: "5.1", stage: "Cierre", discipline: "General", activity: "Entrega a RH", responsible: "Líder de Proyecto", startDate: "2024-12-16", endDate: "2024-12-20", duration: "5 d", progress: 0, status: "Pendiente", observations: "" }
      ]
    }
  ],
  "proj-sap-fiori": [
    {
      id: "wbs-1", wbsLevel: "1.0", stage: "Inicio", isStage: true, expanded: true,
      children: [
        { id: "wbs-1-1", wbsLevel: "1.1", stage: "Inicio", discipline: "General", activity: "Levantamiento de Requerimientos", responsible: "PMO IT", startDate: "2024-02-01", endDate: "2024-02-15", duration: "15 d", progress: 100, status: "Terminada", observations: "Documento BRD firmado" }
      ]
    },
    {
      id: "wbs-2", wbsLevel: "2.0", stage: "Ingeniería", isStage: true, expanded: true,
      children: [
        { id: "wbs-2-1", wbsLevel: "2.1", stage: "Ingeniería", discipline: "Automatización / Control", activity: "Diseño UX/UI Fiori Apps", responsible: "Consultor SAP", startDate: "2024-02-16", endDate: "2024-03-30", duration: "45 d", progress: 100, status: "Terminada", observations: "Mockups aprobados" },
        { id: "wbs-2-2", wbsLevel: "2.2", stage: "Ingeniería", discipline: "Automatización / Control", activity: "Arquitectura de Integración", responsible: "Arquitecto IT", startDate: "2024-03-01", endDate: "2024-04-15", duration: "45 d", progress: 80, status: "En Proceso", observations: "Ajustando OData services" }
      ]
    },
    {
      id: "wbs-3", wbsLevel: "3.0", stage: "Procura", isStage: true, expanded: true,
      children: [
        { id: "wbs-3-1", wbsLevel: "3.1", stage: "Procura", discipline: "Procura", activity: "Licencias SAP Fiori", responsible: "Compras IT", startDate: "2024-04-01", endDate: "2024-04-30", duration: "30 d", progress: 100, status: "Terminada", observations: "Adquiridas" }
      ]
    },
    {
      id: "wbs-4", wbsLevel: "4.0", stage: "Ejecución", isStage: true, expanded: true,
      children: [
        { id: "wbs-4-1", wbsLevel: "4.1", stage: "Ejecución", discipline: "Automatización / Control", activity: "Desarrollo Frontend", responsible: "Desarrollador Fiori", startDate: "2024-05-01", endDate: "2024-07-15", duration: "75 d", progress: 40, status: "En Riesgo", observations: "Falta personal" },
        { id: "wbs-4-2", wbsLevel: "4.2", stage: "Ejecución", discipline: "Automatización / Control", activity: "Pruebas UAT", responsible: "Key Users", startDate: "2024-07-16", endDate: "2024-08-15", duration: "30 d", progress: 0, status: "Pendiente", observations: "" }
      ]
    },
    {
      id: "wbs-5", wbsLevel: "5.0", stage: "Cierre", isStage: true, expanded: false,
      children: [
        { id: "wbs-5-1", wbsLevel: "5.1", stage: "Cierre", discipline: "General", activity: "Go-Live y Soporte", responsible: "PMO IT", startDate: "2024-08-16", endDate: "2024-09-15", duration: "30 d", progress: 0, status: "Pendiente", observations: "" }
      ]
    }
  ],
  "proj-waste-warehouse": [
    {
      id: "wbs-1", wbsLevel: "1.0", stage: "Inicio", isStage: true, expanded: true,
      children: [
        { id: "wbs-1-1", wbsLevel: "1.1", stage: "Inicio", discipline: "Ambiental", activity: "Evaluación Impacto Ambiental", responsible: "Gestor Ambiental", startDate: "2024-01-05", endDate: "2024-02-28", duration: "55 d", progress: 100, status: "Terminada", observations: "Permisos listos" }
      ]
    },
    {
      id: "wbs-2", wbsLevel: "2.0", stage: "Ingeniería", isStage: true, expanded: true,
      children: [
        { id: "wbs-2-1", wbsLevel: "2.1", stage: "Ingeniería", discipline: "Civil", activity: "Planos Nave Industrial", responsible: "Ingeniería", startDate: "2024-03-01", endDate: "2024-04-30", duration: "60 d", progress: 90, status: "En Proceso", observations: "Revisión final" },
        { id: "wbs-2-2", wbsLevel: "2.2", stage: "Ingeniería", discipline: "Ambiental", activity: "Diseño Sistemas Contención", responsible: "Ingeniería", startDate: "2024-04-01", endDate: "2024-05-15", duration: "45 d", progress: 10, status: "En Riesgo", observations: "Dudas normativas" }
      ]
    },
    {
      id: "wbs-3", wbsLevel: "3.0", stage: "Procura", isStage: true, expanded: true,
      children: [
        { id: "wbs-3-1", wbsLevel: "3.1", stage: "Procura", discipline: "Procura", activity: "Licitación Constructora", responsible: "Procura", startDate: "2024-05-16", endDate: "2024-06-30", duration: "45 d", progress: 0, status: "Pendiente", observations: "" }
      ]
    },
    {
      id: "wbs-4", wbsLevel: "4.0", stage: "Ejecución", isStage: true, expanded: true,
      children: [
        { id: "wbs-4-1", wbsLevel: "4.1", stage: "Ejecución", discipline: "Civil", activity: "Construcción Almacén", responsible: "Contratista", startDate: "2024-07-01", endDate: "2024-10-31", duration: "120 d", progress: 0, status: "Pendiente", observations: "" },
        { id: "wbs-4-2", wbsLevel: "4.2", stage: "Ejecución", discipline: "Seguridad Industrial", activity: "Instalación Red Contra Incendio", responsible: "Contratista Especializado", startDate: "2024-09-01", endDate: "2024-10-31", duration: "60 d", progress: 0, status: "Pendiente", observations: "" }
      ]
    },
    {
      id: "wbs-5", wbsLevel: "5.0", stage: "Cierre", isStage: true, expanded: false,
      children: [
        { id: "wbs-5-1", wbsLevel: "5.1", stage: "Cierre", discipline: "Ambiental", activity: "Certificación PROFEPA", responsible: "Gestor Ambiental", startDate: "2024-11-01", endDate: "2024-12-30", duration: "60 d", progress: 0, status: "Pendiente", observations: "" }
      ]
    }
  ],
  "generic": [
    {
      id: "wbs-1", wbsLevel: "1.0", stage: "Inicio", isStage: true, expanded: true,
      children: [
        { id: "wbs-1-1", wbsLevel: "1.1", stage: "Inicio", discipline: "General", activity: "Kick-off Meeting", responsible: "Líder de Proyecto", startDate: "2024-01-10", endDate: "2024-01-10", duration: "1 d", progress: 100, status: "Terminada", observations: "Acta firmada" },
        { id: "wbs-1-2", wbsLevel: "1.2", stage: "Inicio", discipline: "General", activity: "Aprobación de CAPEX", responsible: "Dirección", startDate: "2024-01-15", endDate: "2024-02-15", duration: "30 d", progress: 100, status: "Terminada", observations: "Presupuesto liberado" }
      ]
    },
    {
      id: "wbs-2", wbsLevel: "2.0", stage: "Ingeniería", isStage: true, expanded: true,
      children: [
        { id: "wbs-2-1", wbsLevel: "2.1", stage: "Ingeniería", discipline: "Proceso", activity: "Ingeniería Básica", responsible: "Ingeniería", startDate: "2024-03-01", endDate: "2024-04-15", duration: "45 d", progress: 100, status: "Terminada", observations: "Aprobada" },
        { id: "wbs-2-2", wbsLevel: "2.2", stage: "Ingeniería", discipline: "Mecánica", activity: "Ingeniería de Detalle", responsible: "Ingeniería", startDate: "2024-04-16", endDate: "2024-06-30", duration: "75 d", progress: 60, status: "En Proceso", observations: "En revisión" }
      ]
    },
    {
      id: "wbs-3", wbsLevel: "3.0", stage: "Procura", isStage: true, expanded: true,
      children: [
        { id: "wbs-3-1", wbsLevel: "3.1", stage: "Procura", discipline: "Procura", activity: "Compra Materiales", responsible: "Compras", startDate: "2024-07-01", endDate: "2024-09-15", duration: "75 d", progress: 20, status: "En Proceso", observations: "" }
      ]
    },
    {
      id: "wbs-4", wbsLevel: "4.0", stage: "Ejecución", isStage: true, expanded: true,
      children: [
        { id: "wbs-4-1", wbsLevel: "4.1", stage: "Ejecución", discipline: "General", activity: "Ejecución en Sitio", responsible: "Contratista", startDate: "2024-08-01", endDate: "2024-10-15", duration: "75 d", progress: 0, status: "Pendiente", observations: "" }
      ]
    },
    {
      id: "wbs-5", wbsLevel: "5.0", stage: "Cierre", isStage: true, expanded: false,
      children: [
        { id: "wbs-5-1", wbsLevel: "5.1", stage: "Cierre", discipline: "General", activity: "Entrega Final", responsible: "PM", startDate: "2024-12-16", endDate: "2024-12-20", duration: "5 d", progress: 0, status: "Pendiente", observations: "" }
      ]
    }
  ]
};

export default function WBSSchedule({ projectId, project }) {
  const [data, setData] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    // Load dataset based on projectId or fallback to generic
    const selectedData = datasets[projectId] || datasets["generic"];
    // Deep clone to allow independent expand/collapse state without mutating original
    setData(JSON.parse(JSON.stringify(selectedData)));
  }, [projectId]);

  const toggleExpand = (id) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, expanded: !item.expanded } : item
      )
    );
  };

  // KPI Calculations
  let totalActividades = 0;
  let terminadas = 0;
  let enProceso = 0;
  let retrasadas = 0;

  data.forEach((stage) => {
    stage.children.forEach((task) => {
      totalActividades++;
      if (task.status === "Terminada") terminadas++;
      if (task.status === "En Proceso") enProceso++;
      if (task.status === "En Riesgo") retrasadas++; // Mapping "En Riesgo" to Retrasadas for KPI context
    });
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Terminada":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">{status}</span>;
      case "En Proceso":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-brand-700 border border-blue-200">{status}</span>;
      case "En Riesgo":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">{status}</span>;
      case "Pendiente":
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-industrial-100 text-industrial-600 border border-industrial-200">{status}</span>;
    }
  };

  const getProgressBarColor = (status, progress) => {
    if (progress === 0) return "bg-industrial-300";
    if (status === "En Riesgo") return "bg-red-500";
    if (status === "Terminada" || progress === 100) return "bg-green-500";
    return "bg-brand-500";
  };

  if (data.length === 0) return null;

  return (
    <div className="space-y-6">
      {/* KPIs Superiores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl bg-white shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-industrial-500 text-xs font-bold uppercase tracking-wider mb-1">Total Actividades</span>
          <span className="text-2xl font-black text-industrial-900 font-heading">{totalActividades}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl bg-white shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-green-600 text-xs font-bold uppercase tracking-wider mb-1">Terminadas</span>
          <span className="text-2xl font-black text-green-700 font-heading">{terminadas}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl bg-white shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">En Proceso</span>
          <span className="text-2xl font-black text-brand-700 font-heading">{enProceso}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl bg-white shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-red-600 text-xs font-bold uppercase tracking-wider mb-1">Retrasadas / Riesgo</span>
          <span className="text-2xl font-black text-red-700 font-heading">{retrasadas}</span>
        </div>
      </div>

      {/* Tabla WBS */}
      <div className="glass-panel rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="p-5 border-b border-industrial-100 flex justify-between items-center bg-industrial-50/50">
          <div>
            <h3 className="text-base font-bold text-industrial-950 font-heading">Estructura Desglosada del Trabajo (WBS)</h3>
            <p className="text-xs text-industrial-500 mt-1">
              Plan de ejecución y control de actividades base para el cronograma 
              {project?.projectName ? ` de ${project.projectName}` : ""}.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans whitespace-nowrap">
            <thead className="bg-industrial-50 border-b border-industrial-200 text-industrial-500 uppercase font-bold">
              <tr>
                <th className="px-4 py-3">WBS</th>
                <th className="px-4 py-3">Actividad</th>
                <th className="px-4 py-3">Disciplina</th>
                <th className="px-4 py-3">Responsable</th>
                <th className="px-4 py-3">Fechas</th>
                <th className="px-4 py-3">Duración</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 w-32">Avance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-industrial-100">
              {data.map((stage) => (
                <React.Fragment key={stage.id}>
                  {/* Fila de Etapa (Parent) */}
                  <tr 
                    className="bg-industrial-50/40 hover:bg-industrial-100/60 cursor-pointer transition-colors"
                    onClick={() => toggleExpand(stage.id)}
                  >
                    <td className="px-4 py-3 font-bold text-industrial-900">{stage.wbsLevel}</td>
                    <td className="px-4 py-3 font-bold text-industrial-900 flex items-center gap-1.5">
                      {stage.expanded ? <ChevronDown className="w-4 h-4 text-industrial-400" /> : <ChevronRight className="w-4 h-4 text-industrial-400" />}
                      {stage.stage}
                    </td>
                    <td className="px-4 py-3 text-industrial-400">-</td>
                    <td className="px-4 py-3 text-industrial-400">-</td>
                    <td className="px-4 py-3 text-industrial-400">-</td>
                    <td className="px-4 py-3 text-industrial-400">-</td>
                    <td className="px-4 py-3 text-industrial-400">-</td>
                    <td className="px-4 py-3 text-industrial-400">-</td>
                  </tr>
                  
                  {/* Filas de Actividades (Children) */}
                  {stage.expanded && stage.children.map((task) => (
                    <tr 
                      key={task.id} 
                      className="hover:bg-brand-50/30 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedActivity(task);
                        setIsPanelOpen(true);
                      }}
                    >
                      <td className="px-4 py-3 pl-8 text-industrial-500 font-mono text-[11px]">{task.wbsLevel}</td>
                      <td className="px-4 py-3 text-industrial-800 font-medium">{task.activity}</td>
                      <td className="px-4 py-3 text-industrial-600">{task.discipline}</td>
                      <td className="px-4 py-3 text-industrial-600">{task.responsible}</td>
                      <td className="px-4 py-3 text-industrial-600">
                        <div className="flex flex-col text-[10px]">
                          <span><span className="font-semibold">I:</span> {task.startDate}</span>
                          <span><span className="font-semibold">F:</span> {task.endDate}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-industrial-600">{task.duration}</td>
                      <td className="px-4 py-3">{getStatusBadge(task.status)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-industrial-200 rounded-full h-1.5 flex-1">
                            <div 
                              className={`h-1.5 rounded-full ${getProgressBarColor(task.status, task.progress)}`} 
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] font-bold text-industrial-600 w-8">{task.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overlay & Side Panel */}
      {isPanelOpen && selectedActivity && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40 transition-opacity"
            onClick={() => setIsPanelOpen(false)}
          ></div>
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto flex flex-col transform transition-transform duration-300">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-5 border-b border-industrial-100 bg-industrial-50/50">
              <div>
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider">{selectedActivity.wbsLevel} • {selectedActivity.stage}</span>
                <h3 className="text-lg font-bold text-industrial-950 font-heading leading-tight mt-1">{selectedActivity.activity}</h3>
              </div>
              <button 
                onClick={() => setIsPanelOpen(false)}
                className="p-1.5 rounded-lg text-industrial-400 hover:text-industrial-700 hover:bg-industrial-100 transition-smooth"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="p-6 space-y-6 flex-1">
              
              {/* Properties Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs font-sans">
                <div>
                  <span className="block text-industrial-400 font-semibold mb-1 uppercase text-[10px]">Estatus</span>
                  {getStatusBadge(selectedActivity.status)}
                </div>
                <div>
                  <span className="block text-industrial-400 font-semibold mb-1 uppercase text-[10px]">Avance</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-industrial-900">{selectedActivity.progress}%</span>
                    <div className="w-full bg-industrial-200 rounded-full h-1.5 flex-1">
                      <div 
                        className={`h-1.5 rounded-full ${getProgressBarColor(selectedActivity.status, selectedActivity.progress)}`} 
                        style={{ width: `${selectedActivity.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="block text-industrial-400 font-semibold mb-1 uppercase text-[10px]">Disciplina</span>
                  <span className="font-semibold text-industrial-800">{selectedActivity.discipline}</span>
                </div>
                <div>
                  <span className="block text-industrial-400 font-semibold mb-1 uppercase text-[10px]">Responsable</span>
                  <span className="font-semibold text-industrial-800">{selectedActivity.responsible}</span>
                </div>
                <div>
                  <span className="block text-industrial-400 font-semibold mb-1 uppercase text-[10px]">Fecha Inicio</span>
                  <span className="font-semibold text-industrial-800">{selectedActivity.startDate}</span>
                </div>
                <div>
                  <span className="block text-industrial-400 font-semibold mb-1 uppercase text-[10px]">Fecha Fin</span>
                  <span className="font-semibold text-industrial-800">{selectedActivity.endDate}</span>
                </div>
                <div>
                  <span className="block text-industrial-400 font-semibold mb-1 uppercase text-[10px]">Duración</span>
                  <span className="font-semibold text-industrial-800">{selectedActivity.duration}</span>
                </div>
                <div className="col-span-2">
                  <span className="block text-industrial-400 font-semibold mb-1 uppercase text-[10px]">Observaciones</span>
                  <span className="font-semibold text-industrial-800 block">{selectedActivity.observations || "Ninguna"}</span>
                </div>
              </div>

              {/* Impacto en Proyecto */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-industrial-950 font-heading border-b border-industrial-100 pb-2">Impacto en Proyecto 360°</h4>
                <div className="grid grid-cols-1 gap-2">
                  <div className="p-3 bg-industrial-50 border border-industrial-200 rounded-lg flex gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-bold text-industrial-500 uppercase">Riesgo Asociado</span>
                      <span className="text-xs text-industrial-800 mt-0.5 block">
                        {selectedActivity.status === "En Riesgo" ? "Actividad con desviación potencial en fecha compromiso" :
                         selectedActivity.status === "En Proceso" ? "Sin riesgo crítico detectado" :
                         selectedActivity.status === "Terminada" ? "Sin riesgo activo" :
                         "Dependencia por iniciar"}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-industrial-50 border border-industrial-200 rounded-lg flex gap-3">
                    <CheckSquare className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-bold text-industrial-500 uppercase">Acción Pendiente</span>
                      <span className="text-xs text-industrial-800 mt-0.5 block">
                        {selectedActivity.status === "En Riesgo" ? "Revisar plan de mitigación con responsable" :
                         selectedActivity.status === "En Proceso" ? "Actualizar porcentaje de avance semanal" :
                         selectedActivity.status === "Terminada" ? "Validar cierre documental" :
                         "Confirmar fecha real de arranque"}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-industrial-50 border border-industrial-200 rounded-lg flex gap-3">
                    <FileText className="w-4 h-4 text-industrial-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[10px] font-bold text-industrial-500 uppercase">Documento Requerido</span>
                      <span className="text-xs text-industrial-800 mt-0.5 block">
                        {selectedActivity.status === "En Riesgo" ? "Evidencia de avance requerida" :
                         selectedActivity.status === "En Proceso" ? "Minuta o evidencia de ejecución" :
                         selectedActivity.status === "Terminada" ? "Acta o evidencia final" :
                         "Plan de trabajo pendiente"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* IA Copilot */}
              <div className="p-4 bg-brand-50 border border-brand-200 rounded-xl space-y-2 mt-6">
                <span className="font-bold text-brand-800 flex items-center gap-1.5 text-xs">
                  <Sparkles className="w-3.5 h-3.5" /> IA Copilot Analysis
                </span>
                <p className="text-xs text-industrial-700 leading-relaxed">
                  {selectedActivity.status === "En Riesgo" 
                    ? "La IA recomienda revisar dependencias, responsable y fecha compromiso. Esta actividad podría afectar la ruta crítica del proyecto."
                    : selectedActivity.progress >= 80 && selectedActivity.status !== "Terminada"
                    ? "La IA identifica esta actividad como cercana a cierre. Se recomienda solicitar evidencia final y validar entregables."
                    : selectedActivity.progress === 0 && selectedActivity.status === "Pendiente"
                    ? "La IA detecta una actividad no iniciada. Se recomienda confirmar bloqueadores antes de la siguiente reunión de seguimiento."
                    : "La IA no detecta desviaciones críticas. Se recomienda mantener seguimiento semanal."}
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}
