import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import ChartContainer from "../components/ui/ChartContainer";
import { 
  Briefcase, 
  DollarSign, 
  AlertTriangle, 
  FileCheck2, 
  Database,
  ArrowRight
} from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import KPIWidget from "../components/ui/KPIWidget";
import LoadingState from "../components/ui/LoadingState";
import { useProjects } from "../hooks/useProjects";
import { formatUSD } from "../utils/formatters";
import { seedDatabase } from "../data/seedData";
import { Link } from "react-router-dom";

export function Dashboard() {
  const { projects, loading, refresh } = useProjects();
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

  // Calculate statistics from loaded projects
  const totalProjects = projects.length;
  const totalBudget = projects.reduce((acc, p) => acc + (parseFloat(p.estimatedBudgetUSD) || 0), 0);
  const totalSpent = projects.reduce((acc, p) => acc + (parseFloat(p.spentAmountUSD) || 0), 0);
  
  // Count active approvals (mock or filter)
  const pendingApprovalsCount = projects.filter(p => p.status === "Pending Approval").length;
  const highRiskCount = projects.filter(p => p.riskLevel === "High").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard de Inversión CAPEX"
        description="Vista corporativa y estadística del ciclo de vida de proyectos Styropek."
        actions={
          totalProjects === 0 && (
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

      {totalProjects === 0 ? (
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
          {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPIWidget
                title="Proyectos Activos"
                value={totalProjects}
                icon={<Briefcase className="w-6 h-6" />}
                description="Expedientes en portafolio"
              />
              <KPIWidget
                title="Presupuesto Estimado"
                value={formatUSD(totalBudget)}
                icon={<DollarSign className="w-6 h-6" />}
                description={`Ejecutado: ${formatUSD(totalSpent)}`}
              />
              <KPIWidget
                title="Aprobaciones Pendientes"
                value={pendingApprovalsCount}
                icon={<FileCheck2 className="w-6 h-6" />}
                description="Pendiente por Dirección"
              />
              <KPIWidget
                title="Riesgos Altos"
                value={highRiskCount}
                icon={<AlertTriangle className="w-6 h-6" />}
                description="Requiere mitigación MASH"
                trendDirection={highRiskCount > 0 ? "down" : "neutral"} // Red alarm if risks present
              />
            </div>
            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              {/* Stage Distribution Pie Chart */}
              <ChartContainer>
                <ResponsiveContainer width="100%" height={300}>
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
                      outerRadius={80}
                      fill="#3b82f6" // brand-600
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {projects.reduce((acc, p) => {
                        const stage = p.currentStage || "Sin Etapa";
                        const existing = acc.find((d) => d.name === stage);
                        if (existing) existing.value += 1; else acc.push({ name: stage, value: 1 });
                        return acc;
                      }, []).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={index % 2 === 0 ? "#2563eb" : "#60a5fa"} // brand-700 / brand-400 variant
                          />
                        ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>

              {/* Budget per Plant Bar Chart */}
              <ChartContainer>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={Object.entries(
                      projects.reduce((acc, p) => {
                        const plant = p.plantId || "Sin Planta";
                        const budget = parseFloat(p.estimatedBudgetUSD) || 0;
                        acc[plant] = (acc[plant] || 0) + budget;
                        return acc;
                      }, {})
                    ).map(([plant, budget]) => ({ plant, budget }))}
                    margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="plant" />
                    <YAxis tickFormatter={value => `$${value / 1000}k`} />
                    <Tooltip formatter={(value) => formatUSD(value)} />
                    <Bar dataKey="budget" fill="#2563eb" name="Presupuesto" /> {/* brand-700 */}
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>

          {/* Quick List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl shadow-sm bg-white">
              <h3 className="text-base font-bold text-industrial-950 font-heading mb-4 flex justify-between items-center">
                <span>Proyectos Recientes</span>
                <Link to="/portfolio" className="text-xs text-brand-600 hover:underline flex items-center gap-1">
                  Ver portafolio completo <ArrowRight className="w-3.5 h-3.5" />
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

            <div className="glass-panel p-6 rounded-2xl shadow-sm bg-white">
              <h3 className="text-base font-bold text-industrial-950 font-heading mb-4">
                Atención MASH & HSE
              </h3>
              <p className="text-xs text-industrial-500 leading-relaxed">
                Los procedimientos **ADP-01** y **ADP-02** requieren la pre-validación de viabilidad MASH. Asegúrate de verificar las variables de proceso y de seguridad del sitio antes de enviar la aprobación del ADP.
              </p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5 mt-4 text-[11px] text-amber-800">
                <span className="font-bold uppercase block mb-1">Recordatorio de Seguridad</span>
                Todo proyecto industrial clasificado como "Proceso" o "Eléctrico" debe contar obligatoriamente con el checklist eléctrico y revisión del MOC operativa.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export default Dashboard;
