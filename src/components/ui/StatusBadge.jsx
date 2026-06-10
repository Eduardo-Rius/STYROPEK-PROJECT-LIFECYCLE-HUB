import React from "react";
import { PROJECT_STATES } from "../../utils/constants";

/**
 * StatusBadge Component
 * Displays the state of a project with modern, HSL-tailored colors.
 * @param {Object} props
 * @param {string} props.status - The status ID (e.g. 'Draft', 'Approved')
 * @param {string} [props.className] - Optional CSS overrides
 */
export function StatusBadge({ status, className = "" }) {
  const stateConfig = PROJECT_STATES[status.toUpperCase().replace(" ", "_")] || {
    label: status,
    color: "gray"
  };

  const colorMap = {
    gray: "bg-industrial-100 text-industrial-800 border-industrial-200/50",
    blue: "bg-brand-50 text-brand-700 border-brand-200/50",
    cyan: "bg-cyan-50 text-cyan-700 border-cyan-200/50",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200/50",
    purple: "bg-purple-50 text-purple-700 border-purple-200/50",
    amber: "bg-amber-50 text-amber-700 border-amber-200/50",
    orange: "bg-orange-50 text-orange-700 border-orange-200/50",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200/50",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
    teal: "bg-teal-50 text-teal-700 border-teal-200/50",
    green: "bg-green-50 text-green-700 border-green-200/50",
    rose: "bg-rose-50 text-rose-700 border-rose-200/50"
  };

  const colors = colorMap[stateConfig.color] || colorMap.gray;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-smooth ${colors} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-70"></span>
      {stateConfig.label}
    </span>
  );
}
export default StatusBadge;
