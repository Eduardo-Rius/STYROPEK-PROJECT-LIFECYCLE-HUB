import React, { useState, useRef } from "react";
import { ALLOWED_FILE_EXTENSIONS } from "../../utils/constants";
import { formatFileSize } from "../../utils/formatters";

/**
 * FileUploader Component
 * Renders file dropping boundaries and input selections for project documents.
 * @param {Object} props
 * @param {Function} props.onUpload - Triggered with the selected File object
 * @param {boolean} [props.loading] - Uploading status
 * @param {string} [props.accept] - Input accept format
 */
export function FileUploader({ onUpload, loading = false, accept = ".pdf,.docx,.xlsx,.pptx,.png,.jpg,.jpeg" }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    if (!ALLOWED_FILE_EXTENSIONS.includes(ext)) {
      alert(`Formato inválido. Extensiones permitidas: ${ALLOWED_FILE_EXTENSIONS.join(", ")}`);
      return;
    }
    // Limit to 50MB
    if (file.size > 50 * 1024 * 1024) {
      alert("El archivo excede el tamaño máximo permitido de 50MB.");
      return;
    }
    setSelectedFile(file);
  };

  const triggerInput = () => {
    fileInputRef.current.click();
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) return;
    onUpload(selectedFile).then(() => {
      setSelectedFile(null);
    });
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerInput}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-smooth flex flex-col items-center justify-center ${
          dragActive
            ? "border-brand-600 bg-brand-50/30"
            : "border-industrial-300 hover:border-brand-400 bg-industrial-50/20"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
        />
        
        <svg
          className="w-10 h-10 text-industrial-400 mb-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <p className="text-sm font-semibold text-industrial-800">
          Arrastra tu archivo aquí o <span className="text-brand-600 underline">búscalo</span>
        </p>
        <p className="text-xs text-industrial-400 mt-1">
          Formatos válidos: {ALLOWED_FILE_EXTENSIONS.join(", ").toUpperCase()} (Max. 50MB)
        </p>
      </div>

      {selectedFile && (
        <div className="mt-4 p-3 bg-industrial-100/50 rounded-lg flex items-center justify-between border border-industrial-200">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-industrial-800 truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-industrial-400">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              className="text-xs font-semibold text-industrial-500 hover:text-industrial-700 px-2.5 py-1.5 rounded bg-industrial-200/50"
            >
              Remover
            </button>
            <button
              disabled={loading}
              onClick={(e) => {
                e.stopPropagation();
                handleUploadSubmit();
              }}
              className="text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 px-3 py-1.5 rounded shadow-sm"
            >
              {loading ? "Subiendo..." : "Subir archivo"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default FileUploader;
