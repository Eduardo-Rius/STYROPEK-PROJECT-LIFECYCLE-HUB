import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProject } from "../hooks/useProject";
import { db } from "../services/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createAuditLog } from "../services/auditService";
import ValidationBanner from "../components/common/ValidationBanner";
import SectionCard from "../components/common/SectionCard";
import FormStepper from "../components/common/FormStepper";

export default function InvestmentRequestForm() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { investmentRequest, refresh } = useProject(projectId);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);

  // Form fields – pre‑populate if an existing request exists
  const [background, setBackground] = useState(investmentRequest?.background || "");
  const [scopeDescription, setScopeDescription] = useState(investmentRequest?.scopeDescription || "");
  const [objectives, setObjectives] = useState(investmentRequest?.objectives || "");
  const [expectedBenefits, setExpectedBenefits] = useState(investmentRequest?.expectedBenefits || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    // Simple client‑side validation
    const validation = validateInvestmentRequest({ background, scopeDescription, objectives, expectedBenefits });
    if (!validation.valid) {
      setErrors(validation.messages);
      setLoading(false);
      return;
    }
    try {
      const reqRef = doc(collection(db, "investmentRequests"));
      await setDoc(reqRef, {
        requestId: reqRef.id,
        projectId,
        background,
        scopeDescription,
        objectives,
        expectedBenefits,
        status: "Submitted",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
      });
      // Audit log
      await createAuditLog({
        projectId,
        userId: user.uid,
        action: "INVESTMENT_REQUEST_CREATED",
        module: "INVESTMENT_REQUEST",
        newValue: { requestId: reqRef.id },
      });
      refresh();
      navigate(`/project/${projectId}`);
    } catch (err) {
      console.error(err);
      setErrors([err.message]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <SectionCard title="Solicitud de Inversión" description="Complete los campos y envíe la solicitud.">
        {errors.length > 0 && <ValidationBanner messages={errors} />}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-industrial-700 mb-1">Antecedente / Problema</label>
            <textarea
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-full rounded-md border border-industrial-200 p-2 focus:outline-none focus:ring-1 focus:ring-brand-500"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-industrial-700 mb-1">Alcance Operativo</label>
            <textarea
              value={scopeDescription}
              onChange={(e) => setScopeDescription(e.target.value)}
              className="w-full rounded-md border border-industrial-200 p-2 focus:outline-none focus:ring-1 focus:ring-brand-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-industrial-700 mb-1">Objetivos del Proyecto</label>
            <textarea
              value={objectives}
              onChange={(e) => setObjectives(e.target.value)}
              className="w-full rounded-md border border-industrial-200 p-2 focus:outline-none focus:ring-1 focus:ring-brand-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-industrial-700 mb-1">Beneficios Esperados</label>
            <textarea
              value={expectedBenefits}
              onChange={(e) => setExpectedBenefits(e.target.value)}
              className="w-full rounded-md border border-industrial-200 p-2 focus:outline-none focus:ring-1 focus:ring-brand-500"
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition"
          >
            {loading ? "Guardando…" : "Crear Solicitud"}
          </button>
        </form>
      </SectionCard>
    </div>
  );
}

// Simple validation helper – kept local to avoid circular imports
function validateInvestmentRequest(data) {
  const messages = [];
  if (!data.background?.trim()) messages.push("Antecedente es requerido.");
  if (!data.scopeDescription?.trim()) messages.push("Alcance Operativo es requerido.");
  if (!data.objectives?.trim()) messages.push("Objetivos son requeridos.");
  if (!data.expectedBenefits?.trim()) messages.push("Beneficios esperados son requeridos.");
  return { valid: messages.length === 0, messages };
}
