import React, { useState } from "react";
import { Grid, List, Plus, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import ProjectCard from "../components/ui/ProjectCard";
import ProjectTable from "../components/ui/ProjectTable";
import LoadingState from "../components/ui/LoadingState";
import { useProjects } from "../hooks/useProjects";
import { STAGES, PROJECT_STATES, ROLES } from "../utils/constants";
import { useAuth } from "../hooks/useAuth";

export function Portfolio() {
  const { hasPermission } = useAuth();
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "table"
  const { projects, loading, filters, updateFilters, resetFilters } = useProjects();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    updateFilters({ [name]: value });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Portafolio de Inversión CAPEX"
        description="Explora y filtra expedientes del portafolio completo de proyectos Styropek."
        actions={
          hasPermission("canCreateProject") && (
            <Link
              to="/create-project"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-xs shadow-md shadow-blue-200 transition-smooth"
            >
              <Plus className="w-4 h-4" />
              Nuevo Proyecto
            </Link>
          )
        }
      />

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-xl shadow-sm bg-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-industrial-500 mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filtros:</span>
          </div>

          <select
            name="plantId"
            value={filters.plantId || ""}
            onChange={handleFilterChange}
            className="text-xs bg-industrial-50 border border-industrial-250/80 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white text-industrial-700 transition-smooth"
          >
            <option value="">Todas las Plantas</option>
            <option value="ALT">Altamira</option>
            <option value="CDMX">Oficinas CDMX</option>
          </select>

          <select
            name="areaId"
            value={filters.areaId || ""}
            onChange={handleFilterChange}
            className="text-xs bg-industrial-50 border border-industrial-250/80 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white text-industrial-700 transition-smooth"
          >
            <option value="">Todas las Áreas</option>
            <option value="PROY">Proyectos</option>
            <option value="MASH">MASH</option>
            <option value="TI">Sistemas (TI)</option>
            <option value="MANT">Mantenimiento</option>
          </select>

          <select
            name="stage"
            value={filters.stage || ""}
            onChange={handleFilterChange}
            className="text-xs bg-industrial-50 border border-industrial-250/80 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white text-industrial-700 transition-smooth"
          >
            <option value="">Todas las Etapas</option>
            {Object.values(STAGES).map(s => (
              <option key={s.id} value={s.id}>{s.id}</option>
            ))}
          </select>

          <select
            name="status"
            value={filters.status || ""}
            onChange={handleFilterChange}
            className="text-xs bg-industrial-50 border border-industrial-250/80 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500 focus:bg-white text-industrial-700 transition-smooth"
          >
            <option value="">Todos los Estados</option>
            {Object.values(PROJECT_STATES).map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>

          {(filters.plantId || filters.areaId || filters.stage || filters.status) && (
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 ml-2"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center border border-industrial-200 rounded-lg p-0.5 shrink-0">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-1.5 rounded-md transition-smooth ${
              viewMode === "grid" ? "bg-industrial-100 text-brand-600" : "text-industrial-450 hover:bg-industrial-50"
            }`}
            title="Cuadrícula"
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-md transition-smooth ${
              viewMode === "table" ? "bg-industrial-100 text-brand-600" : "text-industrial-450 hover:bg-industrial-50"
            }`}
            title="Lista"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingState message="Buscando proyectos..." />
      ) : projects.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-industrial-200 rounded-2xl bg-white/60">
          <p className="text-sm text-industrial-500">Ningún proyecto coincide con los filtros especificados.</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.projectId} project={project} />
          ))}
        </div>
      ) : (
        <ProjectTable projects={projects} />
      )}
    </div>
  );
}
export default Portfolio;
