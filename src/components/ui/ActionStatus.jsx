import React from "react";
import { formatDate } from "../../utils/formatters";

/**
 * ActionStatus Component
 * Displays a clean, tabular list or cards of action items.
 * @param {Object} props
 * @param {Array} props.actions - Actions list
 * @param {Function} [props.onComplete] - Complete callback
 * @param {string} [props.currentUserId] - Current user UID
 */
export function ActionStatus({ actions = [], onComplete, currentUserId }) {
  if (actions.length === 0) {
    return (
      <div className="text-center p-6 bg-industrial-100/40 rounded-lg text-sm text-industrial-500">
        No hay acciones pendientes cargadas para este proyecto.
      </div>
    );
  }

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "High": return "bg-red-50 text-red-700 border-red-200";
      case "Medium": return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-blue-50 text-brand-700 border-blue-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed": return "text-success bg-green-50/70 border-green-200";
      case "Waiting Evidence": return "text-warning bg-amber-50 border-amber-200";
      case "Open": return "text-brand-600 bg-brand-50 border-brand-200";
      default: return "text-industrial-500 bg-industrial-100 border-industrial-200";
    }
  };

  return (
    <div className="space-y-3">
      {actions.map((act) => {
        const canComplete = act.status !== "Completed" && 
                            (act.responsibleUserId === currentUserId || !currentUserId);
        
        return (
          <div
            key={act.actionId}
            className="p-4 rounded-xl border border-industrial-200 bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow transition-all duration-200"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-semibold text-industrial-900 truncate">
                  {act.title}
                </h4>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getPriorityStyle(act.priority)}`}>
                  {act.priority === "High" ? "Alta" : act.priority === "Medium" ? "Media" : "Baja"}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(act.status)}`}>
                  {act.status}
                </span>
              </div>
              
              {act.description && (
                <p className="text-xs text-industrial-500 mt-1.5 line-clamp-2">
                  {act.description}
                </p>
              )}
              
              <div className="flex gap-4 mt-2 text-[11px] text-industrial-400">
                <p>Fecha límite: <span className="font-semibold">{formatDate(act.dueDate)}</span></p>
                {act.completionDate && <p>Completado: <span className="font-semibold">{formatDate(act.completionDate)}</span></p>}
                <p>Módulo: <span className="font-semibold">{act.sourceModule}</span></p>
              </div>
            </div>

            {canComplete && (
              <button
                onClick={() => onComplete(act.actionId, act.evidenceRequired)}
                className="shrink-0 self-start sm:self-center px-3 py-1.5 text-xs font-bold text-white bg-success hover:bg-emerald-600 rounded-lg shadow-sm shadow-emerald-100 transition-smooth"
              >
                Completar
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
export default ActionStatus;
