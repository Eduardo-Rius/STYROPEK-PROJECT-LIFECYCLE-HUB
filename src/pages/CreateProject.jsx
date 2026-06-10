import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import PageHeader from "../components/ui/PageHeader";
import { createProject } from "../services/projectService";
import { createInvestmentRequest } from "../services/investmentRequestService";
import { useAuth } from "../hooks/useAuth";

// Form validation schema combining Project and Investment Request details
const creationFormSchema = z.object({
  projectName: z.string().min(5, "El nombre del proyecto debe tener al menos 5 caracteres"),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  plantId: z.string().min(1, "Selecciona una planta"),
  areaId: z.string().min(1, "Selecciona un área"),
  department: z.string().min(1, "Especifica el departamento"),
  costCenter: z.string().min(1, "Especifica el centro de costos"),
  projectLeaderId: z.string().min(1, "Selecciona un líder de proyecto"),
  responsibleUserId: z.string().min(1, "Selecciona el responsable de área"),
  sponsorId: z.string().min(1, "Especifica el sponsor directivo"),
  projectTypeId: z.string().min(1, "Selecciona el tipo de proyecto"),
  investmentType: z.string().min(1, "Selecciona el tipo de inversión"),
  investmentFocus: z.string().min(1, "Especifica el enfoque de la inversión"),
  estimatedBudgetUSD: z.coerce.number().positive("El presupuesto debe ser un número positivo"),
  estimatedStartDate: z.string().min(1, "Selecciona la fecha estimada de inicio"),
  estimatedEndDate: z.string().min(1, "Selecciona la fecha estimada de cierre"),
  
  // Mandatory Investment Request fields
  background: z.string().min(10, "El antecedente de la solicitud es obligatorio (mínimo 10 caracteres)"),
  scopeDescription: z.string().min(10, "El alcance de la solicitud es obligatorio (mínimo 10 caracteres)"),
  objectives: z.string().min(10, "Los objetivos son obligatorios (mínimo 10 caracteres)"),
  expectedBenefits: z.string().min(10, "Los beneficios esperados son obligatorios (mínimo 10 caracteres)")
});

export function CreateProject() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(creationFormSchema),
    defaultValues: {
      estimatedBudgetUSD: 0,
      department: "Operaciones",
      costCenter: "CC-OP-001",
      projectLeaderId: "usr-leader",
      responsibleUserId: "usr-mash",
      sponsorId: "usr-director",
      investmentType: "Productividad",
      investmentFocus: "Seguridad"
    }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const site = data.plantId === "ALT" ? "Planta Altamira" : "Oficinas CDMX";

      // 1. Create Project
      const projectPayload = {
        projectName: data.projectName,
        description: data.description,
        site,
        plantId: data.plantId,
        businessUnit: "Soporte",
        areaId: data.areaId,
        department: data.department,
        costCenter: data.costCenter,
        requesterId: user.uid,
        projectLeaderId: data.projectLeaderId,
        responsibleUserId: data.responsibleUserId,
        sponsorId: data.sponsorId,
        projectTypeId: data.projectTypeId,
        investmentType: data.investmentType,
        investmentFocus: data.investmentFocus,
        status: "Draft",
        currentStage: "ADP-01",
        estimatedBudgetUSD: data.estimatedBudgetUSD,
        estimatedStartDate: new Date(data.estimatedStartDate),
        estimatedEndDate: new Date(data.estimatedEndDate),
        priority: "Medium",
        riskLevel: "Medium"
      };

      const projectId = await createProject(projectPayload, user.uid);

      // 2. Create linked Investment Request (RN-03 compliance)
      const requestPayload = {
        projectId,
        requestName: `Solicitud de Inversión - ${data.projectName}`,
        requesterId: user.uid,
        areaId: data.areaId,
        costCenter: data.costCenter,
        site,
        background: data.background,
        scopeDescription: data.scopeDescription,
        objectives: data.objectives,
        expectedBenefits: data.expectedBenefits,
        estimatedSavingsUSD: 0,
        timeReductionHours: 0,
        involvesFixedAssetReplacement: false,
        status: "Submitted"
      };

      await createInvestmentRequest(requestPayload, user.uid);

      // Redirect to Project 360 view
      navigate(`/project/${projectId}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Error al crear el proyecto y la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Generar Nuevo Proyecto CAPEX"
        description="Registra la propuesta técnica e inicia la Solicitud de Inversión asociada (ADP-01)."
      />

      {error && (
        <div className="p-4 bg-danger/10 border border-danger/35 rounded-xl text-red-700 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        {/* Section 1: Project Metadata */}
        <div className="glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-6">
          <h3 className="text-base font-bold text-industrial-950 font-heading border-b border-industrial-100 pb-3">
            1. Datos Generales del Proyecto
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-industrial-500 mb-1.5 uppercase">
                Nombre del Proyecto
              </label>
              <input
                type="text"
                {...register("projectName")}
                className="w-full text-sm border border-industrial-250/80 rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-500 focus:outline-none bg-industrial-50/20"
                placeholder="Ej. Reubicación de charolas de contención de aceite"
              />
              {errors.projectName && (
                <p className="text-red-500 text-xs mt-1">{errors.projectName.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-industrial-500 mb-1.5 uppercase">
                Descripción Técnica
              </label>
              <textarea
                {...register("description")}
                rows="3"
                className="w-full text-sm border border-industrial-250/80 rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-500 focus:outline-none bg-industrial-50/20"
                placeholder="Describe brevemente el alcance y justificación general..."
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-industrial-500 mb-1.5 uppercase">
                Planta / Ubicación
              </label>
              <select
                {...register("plantId")}
                className="w-full text-sm border border-industrial-250/80 rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-500 focus:outline-none bg-industrial-50/20"
              >
                <option value="">-- Selecciona planta --</option>
                <option value="ALT">Altamira (Plant)</option>
                <option value="CDMX">Oficinas CDMX</option>
              </select>
              {errors.plantId && (
                <p className="text-red-500 text-xs mt-1">{errors.plantId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-industrial-500 mb-1.5 uppercase">
                Área Solicitante
              </label>
              <select
                {...register("areaId")}
                className="w-full text-sm border border-industrial-250/80 rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-500 focus:outline-none bg-industrial-50/20"
              >
                <option value="">-- Selecciona área --</option>
                <option value="PROY">Proyectos</option>
                <option value="MASH">MASH</option>
                <option value="TI">TI / Sistemas</option>
                <option value="OPER">Operaciones</option>
                <option value="MANT">Mantenimiento</option>
              </select>
              {errors.areaId && (
                <p className="text-red-500 text-xs mt-1">{errors.areaId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-industrial-500 mb-1.5 uppercase">
                Líder de Proyecto (LP)
              </label>
              <select
                {...register("projectLeaderId")}
                className="w-full text-sm border border-industrial-250/80 rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-500 focus:outline-none bg-industrial-50/20"
              >
                <option value="usr-leader">Ing. Carlos Mendoza (LP)</option>
                <option value="usr-admin">Administrador TI</option>
              </select>
              {errors.projectLeaderId && (
                <p className="text-red-500 text-xs mt-1">{errors.projectLeaderId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-industrial-500 mb-1.5 uppercase">
                Tipo de Proyecto
              </label>
              <select
                {...register("projectTypeId")}
                className="w-full text-sm border border-industrial-250/80 rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-500 focus:outline-none bg-industrial-50/20"
              >
                <option value="">-- Selecciona tipo --</option>
                <option value="TI">TI / Redes</option>
                <option value="INFRA">Infraestructura civil</option>
                <option value="PROC">Proceso Industrial</option>
                <option value="ELEC">Eléctrico / Instrumentación</option>
                <option value="ESG">ESG / Ambiental</option>
              </select>
              {errors.projectTypeId && (
                <p className="text-red-500 text-xs mt-1">{errors.projectTypeId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-industrial-500 mb-1.5 uppercase">
                Presupuesto Estimado (USD)
              </label>
              <input
                type="number"
                {...register("estimatedBudgetUSD")}
                className="w-full text-sm border border-industrial-250/80 rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-500 focus:outline-none bg-industrial-50/20 font-semibold text-industrial-900"
              />
              {errors.estimatedBudgetUSD && (
                <p className="text-red-500 text-xs mt-1">{errors.estimatedBudgetUSD.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-industrial-400 mb-1 uppercase">
                  Inicio Estimado
                </label>
                <input
                  type="date"
                  {...register("estimatedStartDate")}
                  className="w-full text-xs border border-industrial-250/80 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-brand-500 focus:outline-none bg-industrial-50/20"
                />
                {errors.estimatedStartDate && (
                  <p className="text-red-500 text-[10px] mt-1">{errors.estimatedStartDate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-industrial-400 mb-1 uppercase">
                  Cierre Estimado
                </label>
                <input
                  type="date"
                  {...register("estimatedEndDate")}
                  className="w-full text-xs border border-industrial-250/80 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-brand-500 focus:outline-none bg-industrial-50/20"
                />
                {errors.estimatedEndDate && (
                  <p className="text-red-500 text-[10px] mt-1">{errors.estimatedEndDate.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Investment Request */}
        <div className="glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-6">
          <h3 className="text-base font-bold text-industrial-950 font-heading border-b border-industrial-100 pb-3">
            2. Justificación de la Solicitud de Inversión (Materia CAPEX)
          </h3>
          
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-industrial-500 mb-1.5 uppercase">
                Antecedente / Problema Detectado
              </label>
              <textarea
                {...register("background")}
                rows="3"
                className="w-full text-sm border border-industrial-250/80 rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-500 focus:outline-none bg-industrial-50/20"
                placeholder="Describe las fallas actuales o requerimiento que motiva el proyecto..."
              ></textarea>
              {errors.background && (
                <p className="text-red-500 text-xs mt-1">{errors.background.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-industrial-500 mb-1.5 uppercase">
                Definición del Alcance Operativo
              </label>
              <textarea
                {...register("scopeDescription")}
                rows="3"
                className="w-full text-sm border border-industrial-250/80 rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-500 focus:outline-none bg-industrial-50/20"
                placeholder="Detalla las actividades específicas a realizar..."
              ></textarea>
              {errors.scopeDescription && (
                <p className="text-red-500 text-xs mt-1">{errors.scopeDescription.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-industrial-500 mb-1.5 uppercase">
                  Objetivos Claros
                </label>
                <textarea
                  {...register("objectives")}
                  rows="3"
                  className="w-full text-sm border border-industrial-250/80 rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-500 focus:outline-none bg-industrial-50/20"
                  placeholder="Detalla qué indicadores se planean alcanzar..."
                ></textarea>
                {errors.objectives && (
                  <p className="text-red-500 text-xs mt-1">{errors.objectives.message}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-industrial-500 mb-1.5 uppercase">
                  Beneficios Esperados
                </label>
                <textarea
                  {...register("expectedBenefits")}
                  rows="3"
                  className="w-full text-sm border border-industrial-250/80 rounded-lg px-3 py-2 focus:ring-1 focus:ring-brand-500 focus:outline-none bg-industrial-50/20"
                  placeholder="Detalla retornos, reducción de riesgos o ahorros..."
                ></textarea>
                {errors.expectedBenefits && (
                  <p className="text-red-500 text-xs mt-1">{errors.expectedBenefits.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("/portfolio")}
            className="px-5 py-2.5 font-semibold text-sm rounded-lg bg-industrial-100 hover:bg-industrial-200 text-industrial-700 transition-smooth"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2.5 font-semibold text-sm rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-blue-100 transition-smooth"
          >
            {loading ? "Creando expediente..." : "Iniciar Proyecto"}
          </button>
        </div>
      </form>
    </div>
  );
}
export default CreateProject;
