import React from "react";

/**
 * ConfirmDialog Component
 * A modal dialog for double-confirming sensitive system actions.
 * @param {Object} props
 * @param {boolean} props.isOpen - Visiblity state
 * @param {string} props.title - Heading
 * @param {string} props.message - Descriptive text
 * @param {Function} props.onConfirm - OK handler
 * @param {Function} props.onCancel - Cancel handler
 * @param {string} [props.confirmText] - Button prompt
 * @param {string} [props.cancelText] - Button prompt
 * @param {boolean} [props.isDanger] - Danger styling (red buttons)
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isDanger = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-industrial-950/40 backdrop-blur-sm animate-fade-in">
      <div className="glass-panel w-full max-w-md rounded-xl p-6 shadow-xl border border-industrial-200 animate-scale-up">
        <h3 className="text-lg font-bold text-industrial-950 font-heading">
          {title}
        </h3>
        <p className="text-sm text-industrial-500 mt-2 font-sans leading-relaxed">
          {message}
        </p>
        
        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-industrial-100 hover:bg-industrial-200 text-industrial-700 transition-smooth"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold rounded-lg text-white transition-smooth ${
              isDanger 
                ? "bg-danger hover:bg-red-600 shadow-sm shadow-red-200" 
                : "bg-brand-600 hover:bg-brand-700 shadow-sm shadow-blue-200"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
export default ConfirmDialog;
