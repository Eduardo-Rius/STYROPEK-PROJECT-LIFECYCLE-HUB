import React from "react";

/**
 * EmptyState Component
 * @param {Object} props
 * @param {string} props.title - Main prompt
 * @param {string} props.description - Supportive text
 * @param {React.ReactNode} [props.icon] - Icon component
 * @param {React.ReactNode} [props.action] - Action button
 * @param {string} [props.className] - CSS overrides
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
  className = ""
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 border border-dashed border-industrial-300 rounded-xl bg-industrial-50/50 ${className}`}
    >
      {icon ? (
        <div className="p-4 bg-industrial-100 rounded-full text-industrial-400 mb-4">
          {icon}
        </div>
      ) : (
        <div className="w-12 h-12 rounded-full bg-industrial-100 mb-4 flex items-center justify-center text-industrial-400 font-bold text-xl">
          ?
        </div>
      )}
      
      <h3 className="text-base font-semibold text-industrial-900 font-heading">
        {title}
      </h3>
      <p className="text-sm text-industrial-500 mt-1 max-w-sm">
        {description}
      </p>
      
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
export default EmptyState;
