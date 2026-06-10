import React from "react";

/**
 * KPIWidget Component
 * Renders statistical indicators for CAPEX dashboards with clean, premium layout.
 * @param {Object} props
 * @param {string} props.title - Metric title
 * @param {string|number} props.value - Numeric display value
 * @param {React.ReactNode} [props.icon] - Lucide icon component
 * @param {string} [props.description] - Supporting subtext
 * @param {string} [props.trend] - E.g. "+12% vs last month"
 * @param {string} [props.trendDirection] - "up" | "down" | "neutral"
 * @param {string} [props.className] - CSS overrides
 */
export function KPIWidget({
  title,
  value,
  icon,
  description,
  trend,
  trendDirection = "neutral",
  className = ""
}) {
  const trendColor = 
    trendDirection === "up" ? "text-success" : 
    trendDirection === "down" ? "text-danger" : "text-industrial-500";

  return (
    <div
      className={`glass-panel p-6 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex justify-between items-start ${className}`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-industrial-500 tracking-wider uppercase font-heading">
          {title}
        </p>
        <h3 className="text-3xl font-bold mt-2 text-industrial-900 tracking-tight font-heading">
          {value}
        </h3>
        
        {(trend || description) && (
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            {trend && (
              <span className={`font-semibold ${trendColor}`}>
                {trend}
              </span>
            )}
            {description && (
              <span className="text-industrial-400 truncate">
                {description}
              </span>
            )}
          </div>
        )}
      </div>
      
      {icon && (
        <div className="p-3 bg-brand-50 rounded-lg text-brand-600 ml-4 flex items-center justify-center">
          {icon}
        </div>
      )}
    </div>
  );
}
export default KPIWidget;
