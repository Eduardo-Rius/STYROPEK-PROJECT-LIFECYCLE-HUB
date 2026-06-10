import React from "react";
import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { formatUSD } from "../../utils/formatters";
import { RiskBadge } from "./RiskBadge";
import ProgressBar from "./ProgressBar";
import Avatar from "./Avatar";

/**
 * ProjectCard Component
 * Displays a single project summary in a card layout.
 * @param {Object} props
 * @param {Object} props.project - The project document
 */
export function ProjectCard({ project }) {
  // Safe parsing of numbers
  const budget = parseFloat(project.estimatedBudgetUSD) || 0;
  const spent = parseFloat(project.spentAmountUSD) || 0;
  const pct = budget > 0 ? Math.min(100, Math.round((spent / budget) * 100)) : 0;

  return (
    <Link
      to={`/project/${project.projectId}`}
      className="glass-panel block rounded-xl p-5 border border-industrial-250/70 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-white hover:bg-industrial-50/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[10px] tracking-wider text-industrial-400 font-bold uppercase">
            {project.projectCode}
          </span>
          <h3 className="text-base font-bold text-industrial-950 font-heading mt-0.5 line-clamp-1">
            {project.projectName}
          </h3>
          <p className="text-xs text-industrial-500 mt-1 line-clamp-2 min-h-[32px]">
            {project.description}
          </p>
        </div>
        <RiskBadge level={project.riskLevel} />
        <StatusBadge status={project.status} className="shrink-0" />
      </div>

      <div className="grid grid-cols-2 gap-4 border-t border-b border-industrial-100 py-3 my-4 text-xs">
        <div>
          <p className="text-industrial-400 font-medium">Presupuesto</p>
          <p className="text-sm font-bold text-industrial-800 mt-0.5">
            {formatUSD(budget)}
          </p>
        </div>
        <div>
          <p className="text-industrial-400 font-medium">Ejecutado</p>
          <p className="text-sm font-bold text-industrial-800 mt-0.5">
            {formatUSD(spent)} ({pct}%)
          </p>
        </div>
      </div>
      <ProgressBar percent={pct} color="brand" />

      <div className="flex items-center justify-between text-[11px] text-industrial-500">
        <div>
          <span>Etapa: </span>
          <span className="font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
            {project.currentStage}
          </span>
        </div>
        
        <Avatar text={project.projectLeaderId} size="8" bgColor="brand" />
      </div>
    </Link>
  );
}
export default ProjectCard;
