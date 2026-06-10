import React from "react";

/**
 * LoadingState Component
 * Renders a spinner and text to communicate database fetches.
 * @param {Object} props
 * @param {string} [props.message] - Customized text (e.g. "Cargando proyecto...")
 * @param {string} [props.className] - CSS overrides
 */
export function LoadingState({ message = "Cargando datos...", className = "" }) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 min-h-[200px] ${className}`}
    >
      <div className="relative w-10 h-10">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-100 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-brand-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-industrial-500 mt-4 animate-pulse-subtle">
        {message}
      </p>
    </div>
  );
}
export default LoadingState;
