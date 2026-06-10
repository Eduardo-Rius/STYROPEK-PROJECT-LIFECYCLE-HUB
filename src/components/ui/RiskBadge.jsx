import React from 'react';

/**
 * RiskBadge component shows risk level with consistent colors.
 * @param {Object} props
 * @param {string} props.level - Risk level: 'Low', 'Medium', 'High'.
 */
export function RiskBadge({ level }) {
  const colorMap = {
    Low: 'green',
    Medium: 'amber',
    High: 'red',
  };
  const color = colorMap[level] || 'gray';
  const bgClass = `bg-${color}-100`;
  const textClass = `text-${color}-800`;
  const borderClass = `border-${color}-200`;
  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${bgClass} ${textClass} ${borderClass}`}>Riesgo {level}</span>
  );
}

export default RiskBadge;
