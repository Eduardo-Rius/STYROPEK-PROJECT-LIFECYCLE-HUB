import React from "react";
import { ROLES } from "../../utils/constants";

/**
 * RoleBadge Component
 * Displays user role indicators with specific industrial colors.
 * @param {Object} props
 * @param {string} props.role - User role name
 * @param {string} [props.className] - CSS class extension
 */
export function RoleBadge({ role, className = "" }) {
  const roleColorMap = {
    [ROLES.ADMIN]: "bg-rose-50 text-rose-800 border-rose-200",
    [ROLES.DIRECCION]: "bg-brand-950 text-brand-50 border-brand-800",
    [ROLES.LIDER_PROYECTO]: "bg-brand-50 text-brand-800 border-brand-200",
    [ROLES.SOLICITANTE]: "bg-teal-50 text-teal-800 border-teal-200",
    [ROLES.PLANEACION]: "bg-purple-50 text-purple-800 border-purple-200",
    [ROLES.MASH]: "bg-amber-50 text-amber-800 border-amber-200",
    [ROLES.CONTRALORIA]: "bg-indigo-50 text-indigo-800 border-indigo-200",
    [ROLES.MANTENIMIENTO]: "bg-industrial-100 text-industrial-800 border-industrial-300",
    [ROLES.CONSULTA]: "bg-industrial-50 text-industrial-500 border-industrial-200"
  };

  const badgeStyle = roleColorMap[role] || "bg-industrial-50 text-industrial-600 border-industrial-200";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${badgeStyle} ${className}`}
    >
      {role}
    </span>
  );
}
export default RoleBadge;
