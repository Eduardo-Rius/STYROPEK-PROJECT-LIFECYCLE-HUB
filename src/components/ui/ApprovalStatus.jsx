import React from "react";
import { formatDate } from "../../utils/formatters";

/**
 * ApprovalStatus Component
 * Displays a list of historical and pending approvals.
 * @param {Object} props
 * @param {Array} props.approvals - List of approval documents
 * @param {Function} [props.onApprove] - Approval callback
 * @param {Function} [props.onReject] - Rejection callback
 * @param {string} [props.currentUserId] - Current active user UID
 */
export function ApprovalStatus({
  approvals = [],
  onApprove,
  onReject,
  currentUserId
}) {
  if (approvals.length === 0) {
    return (
      <div className="text-center p-4 bg-industrial-100/40 rounded-lg text-sm text-industrial-500">
        No hay aprobaciones solicitadas para este proyecto.
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "text-success bg-green-50 border-green-200";
      case "Rejected": return "text-danger bg-rose-50 border-rose-200";
      case "Pending": return "text-warning bg-amber-50 border-amber-200";
      default: return "text-industrial-500 bg-industrial-150 border-industrial-300";
    }
  };

  return (
    <div className="space-y-4">
      {approvals.map((approval) => {
        const canAction = approval.status === "Pending" && 
                          (approval.approverId === currentUserId || !approval.approverId);
        
        return (
          <div
            key={approval.approvalId}
            className="p-4 rounded-xl border border-industrial-200 bg-white/60 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-industrial-900 font-heading">
                  Aprobación de {approval.module}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusColor(approval.status)}`}>
                  {approval.status === "Pending" ? "Pendiente" : 
                   approval.status === "Approved" ? "Aprobado" : "Rechazado"}
                </span>
              </div>
              
              <div className="text-xs text-industrial-500 mt-1 space-y-0.5">
                <p>Rol requerido: <span className="font-semibold">{approval.approverRole}</span></p>
                <p>Solicitado el: {formatDate(approval.requestedAt)}</p>
                {approval.approvedAt && <p>Aprobado el: {formatDate(approval.approvedAt)}</p>}
                {approval.rejectedAt && <p>Rechazado el: {formatDate(approval.rejectedAt)}</p>}
              </div>

              {approval.comments && (
                <div className="mt-2 text-xs italic text-industrial-600 bg-industrial-50 p-2 rounded border border-industrial-100">
                  &ldquo;{approval.comments}&rdquo;
                </div>
              )}
            </div>

            {canAction && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onReject(approval.approvalId)}
                  className="px-3 py-1.5 text-xs font-bold text-danger border border-danger/35 hover:bg-rose-50 rounded-lg transition-smooth"
                >
                  Rechazar
                </button>
                <button
                  onClick={() => onApprove(approval.approvalId)}
                  className="px-3 py-1.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-smooth"
                >
                  Aprobar
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
export default ApprovalStatus;
