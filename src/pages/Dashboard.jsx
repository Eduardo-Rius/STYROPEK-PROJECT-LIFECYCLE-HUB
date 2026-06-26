import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { 
  Briefcase, DollarSign, AlertTriangle, FileCheck2, Database, ArrowRight,
  Users, FileText, ShieldCheck, CheckCircle, FilePlus2, FileSearch, 
  FolderKanban, BarChart2, Activity, ShieldAlert, Bolt, TrendingUp, TrendingDown, BarChart3, Clock
} from "lucide-react";
import ChartContainer from "../components/ui/ChartContainer";
import PageHeader from "../components/ui/PageHeader";
import KPIWidget from "../components/ui/KPIWidget";
import LoadingState from "../components/ui/LoadingState";
import { useProjects } from "../hooks/useProjects";
import { useAuth } from "../hooks/useAuth";
import { formatUSD } from "../utils/formatters";
import { seedDatabase } from "../data/seedData";

const getDashboardConfig = (role, stats) => {
  const configs = {
    "Admin": {
      title: "Panel General del Sistema",
      description: "Vista de administrador con control total sobre parámetros y expedientes.",
      kpis: [
        { title: "Proyectos Activos", value: stats.totalProjects, icon: <Briefcase className="w-6 h-6"/>, desc: "Expedientes en portafolio" },
        { title: "Usuarios", value: "32", icon: <Users className="w-6 h-6"/>, desc: "Registrados" },
        { title: "Documentos", value: "145", icon: <FileText className="w-6 h-6"/>, desc: "Indexados" },
        { title: "Auditorías", value: "12", icon: <ShieldCheck className="w-6 h-6"/>, desc: "Registros MOC" }
      ],
      primaryBlocks: ["Actividad reciente", "Salud plataforma", "Administración"]
    },
    "Dirección": {
      title: "Dashboard Ejecutivo CAPEX",
      description: "Vista corporativa y estadística del ciclo de vida de proyectos.",
      kpis: [
        { title: "Presupuesto Total", value: formatUSD(stats.totalBudget), icon: <DollarSign className="w-6 h-6"/>, desc: "CAPEX Autorizado" },
        { title: "Ejecutado", value: formatUSD(stats.totalSpent), icon: <TrendingUp className="w-6 h-6"/>, desc: "Real a la fecha" },
        { title: "Aprobaciones Pendientes", value: stats.pendingApprovalsCount, icon: <FileCheck2 className="w-6 h-6"/>, desc: "Por revisar" },
        { title: "Riesgos Críticos", value: stats.highRiskCount, icon: <AlertTriangle className="w-6 h-6"/>, desc: "Atención requerida", trend: stats.highRiskCount > 0 ? "down" : "neutral" }
      ],
      primaryBlocks: ["Portafolio por planta", "Decisiones pendientes", "Riesgos ejecutivos"]
    },
    "Líder de Proyecto": {
      title: "Mis Proyectos",
      description: "Administración operativa de proyectos asignados.",
      kpis: [
        { title: "Proyectos Asignados", value: stats.totalProjects > 0 ? 2 : 0, icon: <Briefcase className="w-6 h-6"/>, desc: "Activos" },
        { title: "Tareas Abiertas", value: "14", icon: <CheckCircle className="w-6 h-6"/>, desc: "En cronograma" },
        { title: "Riesgos Activos", value: stats.highRiskCount, icon: <AlertTriangle className="w-6 h-6"/>, desc: "Asignados a mis proyectos" },
        { title: "Documentos Pendientes", value: "3", icon: <FileText className="w-6 h-6"/>, desc: "Requeridos" }
      ],
      primaryBlocks: ["Seguimiento de ejecución", "Acciones próximas", "Cronograma"]
    },
    "Planeación Estratégica": {
      title: "Planeación CAPEX",
      description: "Vista de análisis de portafolio e inversiones a largo plazo.",
      kpis: [
        { title: "Proyectos por Etapa", value: stats.totalProjects, icon: <FolderKanban className="w-6 h-6"/>, desc: "En pipeline" },
        { title: "Inversión por Planta", value: "4", icon: <BarChart2 className="w-6 h-6"/>, desc: "Plantas activas" },
        { title: "Riesgos Portafolio", value: stats.highRiskCount, icon: <AlertTriangle className="w-6 h-6"/>, desc: "Global" },
        { title: "Avance Global", value: "42%", icon: <Activity className="w-6 h-6"/>, desc: "Ejecución CAPEX" }
      ],
      primaryBlocks: ["Funnel de inversión", "Prioridades", "Roadmap"]
    },
    "Mantenimiento": {
      title: "Ejecución Técnica",
      description: "Vista enfocada en el avance y mantenimiento de los proyectos asignados.",
      kpis: [
        { title: "Tareas Abiertas", value: "24", icon: <Bolt className="w-6 h-6"/>, desc: "Por ejecutar" },
        { title: "Actividades en Riesgo", value: "2", icon: <AlertTriangle className="w-6 h-6"/>, desc: "Retrasos" },
        { title: "Documentos Técnicos", value: "18", icon: <FileText className="w-6 h-6"/>, desc: "Planos/Manuales" },
        { title: "Proyectos Asignados", value: "3", icon: <Briefcase className="w-6 h-6"/>, desc: "Soporte técnico" }
      ],
      primaryBlocks: ["Cronograma técnico", "Acciones próximas", "Riesgos operativos"]
    },
    "MASH": {
      title: "Seguridad y Riesgos",
      description: "Monitoreo de normativas de seguridad, medio ambiente e higiene.",
      kpis: [
        { title: "Riesgos Abiertos", value: "8", icon: <AlertTriangle className="w-6 h-6"/>, desc: "Global" },
        { title: "Riesgos Críticos", value: stats.highRiskCount, icon: <ShieldAlert className="w-6 h-6"/>, desc: "Alta severidad" },
        { title: "Acciones MASH", value: "12", icon: <Bolt className="w-6 h-6"/>, desc: "Pendientes" },
        { title: "Documentos Seguridad", value: "45", icon: <FileText className="w-6 h-6"/>, desc: "Checklists" }
      ],
      primaryBlocks: ["Riesgos por proyecto", "Acciones preventivas", "Documentos MASH"]
    },
    "Contraloría": {
      title: "Control Financiero CAPEX",
      description: "Seguimiento al ejercicio presupuestal y justificación de desviaciones.",
      kpis: [
        { title: "Presupuesto Aprobado", value: formatUSD(stats.totalBudget), icon: <DollarSign className="w-6 h-6"/>, desc: "CAPEX 2024" },
        { title: "Ejecutado", value: formatUSD(stats.totalSpent), icon: <TrendingUp className="w-6 h-6"/>, desc: "Real" },
        { title: "Variación", value: "1.2%", icon: <TrendingDown className="w-6 h-6"/>, desc: "Desviación" },
        { title: "Aprobaciones", value: stats.pendingApprovalsCount, icon: <FileCheck2 className="w-6 h-6"/>, desc: "Financieras" }
      ],
      primaryBlocks: ["Presupuesto vs ejecutado", "Liberaciones pendientes", "Control documental"]
    },
    "Solicitante": {
      title: "Mis Solicitudes",
      description: "Seguimiento al ciclo de vida de las solicitudes de inversión que has iniciado.",
      kpis: [
        { title: "Solicitudes Creadas", value: "5", icon: <FilePlus2 className="w-6 h-6"/>, desc: "Histórico" },
        { title: "En Revisión", value: "2", icon: <FileSearch className="w-6 h-6"/>, desc: "Actuales" },
        { title: "Aprobadas", value: "3", icon: <CheckCircle className="w-6 h-6"/>, desc: "Avanzadas a ADP" },
        { title: "Rechazadas", value: "0", icon: <AlertTriangle className="w-6 h-6"/>, desc: "Sin pase" }
      ],
      primaryBlocks: ["Estado de solicitudes", "Documentos requeridos", "Próximos pasos"]
    },
    "Consulta": {
      title: "Consulta de Proyectos",
      description: "Vista general y pública del portafolio.",
      kpis: [
        { title: "Proyectos Visibles", value: stats.totalProjects, icon: <Briefcase className="w-6 h-6"/>, desc: "Lectura" },
        { title: "Docs Disponibles", value: "120", icon: <FileText className="w-6 h-6"/>, desc: "Públicos" },
        { title: "Reportes", value: "5", icon: <BarChart3 className="w-6 h-6"/>, desc: "Generados" },
        { title: "Actualizaciones", value: "Hoy", icon: <Clock className="w-6 h-6"/>, desc: "Última act." }
      ],
      primaryBlocks: ["Vista de solo lectura", "Documentos recientes", "Estado general"]
    }
  };
  return configs[role] || configs["Consulta"];
};

export function Dashboard() {
  const { projects, loading, refresh } = useProjects();
  const { profile } = useAuth();
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const result = await seedDatabase();
      if (result === "success") {
        setSeedSuccess(true);
        refresh();
      } else {
        alert("La base de datos ya contiene información o se omitió el sembrado.");
      }
    } catch (error) {
      console.error(error);
      alert("Error al sembrar la base de datos: " + error.message);
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return <LoadingState message="Cargando métricas de portafolio..." />;
  }

  const stats = {
    totalProjects: projects.length,
    totalBudget: projects.reduce((acc, p) => acc + (parseFloat(p.estimatedBudgetUSD) || 0), 0),
    totalSpent: projects.reduce((acc, p) => acc + (parseFloat(p.spentAmountUSD) || 0), 0),
    pendingApprovalsCount: projects.filter(p => p.status === "Pending Approval").length,
    highRiskCount: projects.filter(p => p.riskLevel === "High").length
  };

  const config = getDashboardConfig(profile?.role, stats);

  return (
    <div className="space-y-6">
      <PageHeader
        title={config.title}
        description={config.description}
        actions={
          stats.totalProjects === 0 && (
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs shadow-md shadow-blue-200 disabled:bg-brand-400 transition-smooth"
            >
              <Database className="w-4 h-4" />
              {seeding ? "Sembrando..." : "Cargar Datos Semilla"}
            </button>
          )
        }
      />

      {seedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex justify-between items-center">
          <span>Base de datos poblada con éxito. Proyectos e historial de demostración disponibles.</span>
          <button onClick={() => setSeedSuccess(false)} className="font-bold underline ml-4">Cerrar</button>
        </div>
      )}

      {stats.totalProjects === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-industrial-300 rounded-2xl bg-white text-center">
          <Database className="w-12 h-12 text-industrial-300 mb-4 animate-pulse-subtle" />
          <h3 className="text-lg font-bold text-industrial-900 font-heading">
            Base de datos vacía
          </h3>
          <p className="text-sm text-industrial-500 mt-2 max-w-sm">
            Para iniciar, presiona el botón "Cargar Datos Semilla" arriba a la derecha para poblar el portafolio con datos de prueba industriales.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {config.kpis.map((kpi, index) => (
              <KPIWidget
                key={index}
                title={kpi.title}
                value={kpi.value}
                icon={kpi.icon}
                description={kpi.desc}
                trendDirection={kpi.trend || "neutral"}
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {config.primaryBlocks.map((blockName, idx) => {
              const lowerName = blockName.toLowerCase();
              
              if (lowerName.includes("portafolio") || lowerName.includes("presupuesto") || lowerName.includes("inversión")) {
                return (
                  <div key={idx} className="col-span-1 md:col-span-2 lg:col-span-1 glass-panel p-5 rounded-2xl shadow-sm bg-white border border-industrial-100 flex flex-col">
                    <h3 className="text-base font-bold text-industrial-950 font-heading mb-4">{blockName}</h3>
                    <div className="flex-1 flex items-center justify-center min-h-[250px]">
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={projects.reduce((acc, p) => {
                              const stage = p.currentStage || "Sin Etapa";
                              const existing = acc.find((d) => d.name === stage);
                              if (existing) existing.value += 1; else acc.push({ name: stage, value: 1 });
                              return acc;
                            }, [])}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            fill="#3b82f6"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {projects.map((_, index) => <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#2563eb" : "#60a5fa"} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              }

              if (lowerName.includes("reciente") || lowerName.includes("solicitudes") || lowerName.includes("seguimiento") || lowerName.includes("decisiones") || lowerName.includes("liberaciones")) {
                return (
                  <div key={idx} className="col-span-1 md:col-span-2 lg:col-span-2 glass-panel p-6 rounded-2xl shadow-sm bg-white border border-industrial-100">
                    <h3 className="text-base font-bold text-industrial-950 font-heading mb-4 flex justify-between items-center">
                      <span>{blockName}</span>
                      <Link to="/portfolio" className="text-xs text-brand-600 hover:underline flex items-center gap-1">
                        Ver detalle <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </h3>
                    <div className="divide-y divide-industrial-100">
                      {projects.slice(0, 3).map((p) => {
                        const budget = parseFloat(p.estimatedBudgetUSD) || 0;
                        return (
                          <div key={p.projectId} className="py-3.5 flex justify-between items-center gap-4">
                            <div>
                              <h4 className="text-sm font-semibold text-industrial-900 font-heading">
                                {p.projectName}
                              </h4>
                              <p className="text-xs text-industrial-400 mt-0.5">
                                Código: {p.projectCode} • Etapa: {p.currentStage}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-bold text-industrial-800 block">
                                {formatUSD(budget)}
                              </span>
                              <span className="text-[10px] text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100 mt-1 inline-block">
                                {p.status}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              if (lowerName.includes("riesgo") || lowerName.includes("salud") || lowerName.includes("acciones")) {
                return (
                  <div key={idx} className="col-span-1 glass-panel p-6 rounded-2xl shadow-sm bg-white border border-industrial-100">
                    <h3 className="text-base font-bold text-industrial-950 font-heading mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                      {blockName}
                    </h3>
                    <p className="text-xs text-industrial-500 leading-relaxed">
                      Existen elementos críticos operativos y de seguridad en el portafolio que requieren revisión.
                      Es mandatorio asegurar las mitigaciones de acuerdo al procedimiento operativo.
                    </p>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 mt-4 text-[11px] text-amber-800">
                      <span className="font-bold uppercase block mb-1">Alerta Activa</span>
                      Verifica que los permisos documentales y checklists estén completamente liberados.
                    </div>
                  </div>
                );
              }

              return (
                <div key={idx} className="col-span-1 glass-panel p-6 rounded-2xl shadow-sm bg-white border border-dashed border-industrial-200 flex flex-col items-center justify-center min-h-[200px] text-center">
                  <h3 className="text-sm font-bold text-industrial-900 font-heading mb-2">{blockName}</h3>
                  <p className="text-xs text-industrial-400 max-w-xs">Módulo informativo y funcional parametrizado según los permisos operativos del perfil.</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
