import React from 'react';

/**
 * Wrapper for Recharts components to provide consistent styling and responsiveness.
 * @param {Object} props
 * @param {ReactNode} props.children - Recharts element(s) to render inside the container.
 */
export function ChartContainer({ children }) {
  return (
    <div className="w-full h-64 md:h-80 bg-white p-4 rounded-xl shadow-sm border border-industrial-200">
      {children}
    </div>
  );
}

export default ChartContainer;
