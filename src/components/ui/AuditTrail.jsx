import React from "react";
import { formatDateTime } from "../../utils/formatters";

/**
 * AuditTrail Component
 * Renders a vertical timeline of audit logs.
 * @param {Object} props
 * @param {Array} props.logs - Audit logs list
 */
export function AuditTrail({ logs = [] }) {
  if (logs.length === 0) {
    return (
      <div className="text-center p-6 bg-industrial-100/40 rounded-lg text-sm text-industrial-500">
        No hay registros de auditoría para este proyecto.
      </div>
    );
  }

  const getActionStyle = (action) => {
    switch (action) {
      case "CREATE": return "bg-emerald-500 text-white";
      case "UPDATE": return "bg-brand-500 text-white";
      case "DELETE": return "bg-rose-500 text-white";
      case "STATUS_CHANGE": return "bg-amber-500 text-white";
      case "UPLOAD_DOCUMENT": return "bg-purple-500 text-white";
      case "REQUEST_APPROVAL": return "bg-indigo-500 text-white";
      case "APPROVE": return "bg-success text-white";
      case "REJECT": return "bg-danger text-white";
      default: return "bg-industrial-500 text-white";
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case "CREATE": return "Creación";
      case "UPDATE": return "Actualización";
      case "DELETE": return "Eliminación";
      case "STATUS_CHANGE": return "Cambio de Estado";
      case "UPLOAD_DOCUMENT": return "Carga de Documento";
      case "REQUEST_APPROVAL": return "Solicitud de Aprobación";
      case "APPROVE": return "Aprobado";
      case "REJECT": return "Rechazado";
      default: return action;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-0.5 before:bg-industrial-200">
      {logs.slice(0,20).map((log, index) => (
        <div key={log.auditId || index} className="relative flex flex-col md:flex-row md:items-start gap-2">
          {/* Node */}
          <div className={`absolute -left-[23px] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm ${getActionStyle(log.action)}`}>
            {log.action.substring(0, 2)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-x-2">
              <span className="text-sm font-semibold text-industrial-900 font-heading">
                {getActionLabel(log.action)}
              </span>
              <span className="text-xs text-industrial-400">
                • {log.module}
              </span>
            </div>
            
            <p className="text-xs text-industrial-500 mt-1">
              Realizado por <span className="font-semibold text-industrial-700">{log.userId}</span> el {formatDateTime(log.timestamp)}
            </p>

            {(log.previousValue || log.newValue) && (
              <div className="mt-2 text-[11px] font-mono bg-industrial-100 p-2 rounded max-h-32 overflow-y-auto border border-industrial-200 text-industrial-700">
                {log.previousValue && (
                  <div>
                    <span className="text-rose-600 font-bold">- Prev:</span> {JSON.stringify(log.previousValue)}
                  </div>
                )}
                {log.newValue && (
                  <div className="mt-1">
                    <span className="text-emerald-600 font-bold">+ New:</span> {JSON.stringify(log.newValue)}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
export default AuditTrail;
