import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export default function WBSSchedule() {
  const [data, setData] = useState([
    {
      id: "wbs-1",
      wbsLevel: "1.0",
      stage: "Inicio",
      isStage: true,
      expanded: true,
      children: [
        {
          id: "wbs-1-1",
          wbsLevel: "1.1",
          stage: "Inicio",
          discipline: "General",
          activity: "Kick-off Meeting",
          responsible: "Líder de Proyecto",
          startDate: "2024-01-10",
          endDate: "2024-01-10",
          duration: "1 d",
          progress: 100,
          status: "Terminada",
          observations: "Acta firmada"
        },
        {
          id: "wbs-1-2",
          wbsLevel: "1.2",
          stage: "Inicio",
          discipline: "General",
          activity: "Aprobación de CAPEX",
          responsible: "Dirección",
          startDate: "2024-01-15",
          endDate: "2024-02-15",
          duration: "30 d",
          progress: 100,
          status: "Terminada",
          observations: "Presupuesto liberado"
        }
      ]
    },
    {
      id: "wbs-2",
      wbsLevel: "2.0",
      stage: "Ingeniería",
      isStage: true,
      expanded: true,
      children: [
        {
          id: "wbs-2-1",
          wbsLevel: "2.1",
          stage: "Ingeniería",
          discipline: "Proceso",
          activity: "Ingeniería Básica",
          responsible: "Carlos Mendoza",
          startDate: "2024-03-01",
          endDate: "2024-04-15",
          duration: "45 d",
          progress: 100,
          status: "Terminada",
          observations: "Aprobada por operaciones"
        },
        {
          id: "wbs-2-2",
          wbsLevel: "2.2",
          stage: "Ingeniería",
          discipline: "Mecánica",
          activity: "Ingeniería de Detalle",
          responsible: "Daniel Torres",
          startDate: "2024-04-16",
          endDate: "2024-06-30",
          duration: "75 d",
          progress: 60,
          status: "En Proceso",
          observations: "Retraso en planos mecánicos"
        },
        {
          id: "wbs-2-3",
          wbsLevel: "2.3",
          stage: "Ingeniería",
          discipline: "Eléctrica",
          activity: "Ingeniería Eléctrica",
          responsible: "Ana Rojas",
          startDate: "2024-05-01",
          endDate: "2024-06-15",
          duration: "45 d",
          progress: 0,
          status: "Pendiente",
          observations: ""
        }
      ]
    },
    {
      id: "wbs-3",
      wbsLevel: "3.0",
      stage: "Procura",
      isStage: true,
      expanded: true,
      children: [
        {
          id: "wbs-3-1",
          wbsLevel: "3.1",
          stage: "Procura",
          discipline: "Procura",
          activity: "Compra Equipos Críticos",
          responsible: "María Fernanda",
          startDate: "2024-05-15",
          endDate: "2024-08-30",
          duration: "105 d",
          progress: 25,
          status: "En Riesgo",
          observations: "Proveedor reporta demoras en compresor"
        },
        {
          id: "wbs-3-2",
          wbsLevel: "3.2",
          stage: "Procura",
          discipline: "Procura",
          activity: "Compra Materiales Generales",
          responsible: "María Fernanda",
          startDate: "2024-07-01",
          endDate: "2024-09-15",
          duration: "75 d",
          progress: 0,
          status: "Pendiente",
          observations: ""
        }
      ]
    },
    {
      id: "wbs-4",
      wbsLevel: "4.0",
      stage: "Ejecución",
      isStage: true,
      expanded: true,
      children: [
        {
          id: "wbs-4-1",
          wbsLevel: "4.1",
          stage: "Ejecución",
          discipline: "Civil",
          activity: "Obra Civil y Cimentaciones",
          responsible: "Contratista A",
          startDate: "2024-06-01",
          endDate: "2024-07-30",
          duration: "60 d",
          progress: 10,
          status: "En Proceso",
          observations: "Lluvias han afectado el avance"
        },
        {
          id: "wbs-4-2",
          wbsLevel: "4.2",
          stage: "Ejecución",
          discipline: "Mecánica",
          activity: "Instalación Mecánica",
          responsible: "Contratista B",
          startDate: "2024-08-01",
          endDate: "2024-10-15",
          duration: "75 d",
          progress: 0,
          status: "Pendiente",
          observations: ""
        },
        {
          id: "wbs-4-3",
          wbsLevel: "4.3",
          stage: "Ejecución",
          discipline: "Instrumentación",
          activity: "Montaje de Instrumentos",
          responsible: "Contratista C",
          startDate: "2024-09-15",
          endDate: "2024-10-30",
          duration: "45 d",
          progress: 0,
          status: "Pendiente",
          observations: ""
        },
        {
          id: "wbs-4-4",
          wbsLevel: "4.4",
          stage: "Ejecución",
          discipline: "Proceso",
          activity: "Pruebas y Comisionamiento",
          responsible: "Operaciones",
          startDate: "2024-11-01",
          endDate: "2024-11-30",
          duration: "30 d",
          progress: 0,
          status: "Pendiente",
          observations: ""
        },
        {
          id: "wbs-4-5",
          wbsLevel: "4.5",
          stage: "Ejecución",
          discipline: "General",
          activity: "Arranque de Planta",
          responsible: "Operaciones",
          startDate: "2024-12-01",
          endDate: "2024-12-15",
          duration: "15 d",
          progress: 0,
          status: "Pendiente",
          observations: ""
        }
      ]
    },
    {
      id: "wbs-5",
      wbsLevel: "5.0",
      stage: "Cierre",
      isStage: true,
      expanded: false,
      children: [
        {
          id: "wbs-5-1",
          wbsLevel: "5.1",
          stage: "Cierre",
          discipline: "General",
          activity: "Entrega a Operaciones",
          responsible: "Líder de Proyecto",
          startDate: "2024-12-16",
          endDate: "2024-12-20",
          duration: "5 d",
          progress: 0,
          status: "Pendiente",
          observations: ""
        },
        {
          id: "wbs-5-2",
          wbsLevel: "5.2",
          stage: "Cierre",
          discipline: "General",
          activity: "Capitalización del Activo",
          responsible: "Finanzas",
          startDate: "2024-12-20",
          endDate: "2025-01-15",
          duration: "25 d",
          progress: 0,
          status: "Pendiente",
          observations: ""
        }
      ]
    }
  ]);

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
            <p className="text-xs text-industrial-500 mt-1">Plan de ejecución y control de actividades base para el cronograma.</p>
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
                    <tr key={task.id} className="hover:bg-brand-50/30 transition-colors">
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
    </div>
  );
}
