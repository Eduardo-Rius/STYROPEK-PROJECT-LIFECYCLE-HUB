import React from "react";

/**
 * PageHeader Component
 * @param {Object} props
 * @param {string} props.title - Main title
 * @param {string} [props.description] - Sub-description
 * @param {React.ReactNode} [props.actions] - Action buttons
 * @param {string} [props.className] - CSS overrides
 */
export function PageHeader({ title, description, actions, className = "" }) {
  return (
    <div
      className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-industrial-200/60 mb-6 ${className}`}
    >
      <div>
        <h1 className="text-3xl font-bold text-industrial-950 font-heading tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-industrial-500 mt-1.5 font-sans leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
      
      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
export default PageHeader;
