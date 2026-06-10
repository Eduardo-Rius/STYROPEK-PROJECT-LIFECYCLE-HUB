import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { formatUSD, formatDate } from "../../utils/formatters";

/**
 * ProjectTable Component
 * Renders a tabular list of projects.
 * @param {Object} props
 * @param {Array} props.projects - List of projects
 */
export function ProjectTable({ projects = [] }) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-industrial-200 rounded-xl bg-white text-industrial-500">
        No se encontraron proyectos coincidentes.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-industrial-200 shadow-sm bg-white">
      <table className="w-full border-collapse text-left text-sm text-industrial-600">
        <thead className="bg-industrial-50 text-[11px] font-bold text-industrial-500 uppercase tracking-wider border-b border-industrial-200">
          <tr>
            <th className="px-6 py-4">Código</th>
            <th className="px-6 py-4">Nombre de Proyecto</th>
            <th className="px-6 py-4">Sitio / Planta</th>
            <th className="px-6 py-4">Presupuesto</th>
            <th className="px-6 py-4">Estado</th>
            <th className="px-6 py-4">Etapa</th>
            <th className="px-6 py-4">Inicio Estimado</th>
            <th className="px-6 py-4 text-right">Acción</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-industrial-100 font-sans">
          {projects.map((proj) => (
            <tr key={proj.projectId} className="hover:bg-industrial-50/40 transition-colors">
              <td className="px-6 py-4 font-mono font-semibold text-industrial-800">
                {proj.projectCode}
              </td>
              <td className="px-6 py-4">
                <div className="font-semibold text-industrial-950 font-heading">
                  {proj.projectName}
                </div>
                <div className="text-xs text-industrial-400 mt-0.5 line-clamp-1 max-w-[200px]">
                  {proj.description}
                </div>
              </td>
              <td className="px-6 py-4">
                {proj.site || "N/A"}
              </td>
              <td className="px-6 py-4 font-semibold text-industrial-900">
                {formatUSD(proj.estimatedBudgetUSD)}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={proj.status} />
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-0.5 bg-brand-50 text-brand-700 border border-brand-200/50 rounded text-xs font-semibold">
                  {proj.currentStage}
                </span>
              </td>
              <td className="px-6 py-4">
                {formatDate(proj.estimatedStartDate)}
              </td>
              <td className="px-6 py-4 text-right">
                <Link
                  to={`/project/${proj.projectId}`}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-smooth"
                >
                  Expediente
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default ProjectTable;
