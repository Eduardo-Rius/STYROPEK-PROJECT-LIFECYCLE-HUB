import React from 'react';

/**
 * Simple progress bar component.
 * @param {Object} props
 * @param {number} props.percent - Progress percentage (0-100).
 * @param {string} [props.color] - Tailwind color without prefix (e.g., 'brand', 'green').
 */
export function ProgressBar({ percent, color = 'brand' }) {
  const clamped = Math.min(100, Math.max(0, percent));
  const bg = `bg-${color}-500`;
  const bgLight = `bg-${color}-100`;
  return (
    <div className={`w-full h-2 rounded-full ${bgLight}`}> 
      <div
        className={`${bg} h-full rounded-full transition-all duration-300`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export default ProgressBar;
