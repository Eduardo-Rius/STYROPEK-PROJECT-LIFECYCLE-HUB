import { doc, writeBatch, collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export const SEED_PLANTS = [
  { plantId: "ALT", plantName: "Altamira Plant", country: "México", location: "Altamira, Tamaulipas", isActive: true },
  { plantId: "CDMX", plantName: "Oficinas CDMX", country: "México", location: "Ciudad de México", isActive: true }
];

export const SEED_AREAS = [
  { areaId: "PROY", areaName: "Proyectos", plantId: "ALT", responsibleUserId: "usr-leader", isActive: true },
  { areaId: "PLAN", areaName: "Planeación Estratégica", plantId: "CDMX", responsibleUserId: "usr-plan", isActive: true },
  { areaId: "OPER", areaName: "Operaciones", plantId: "ALT", responsibleUserId: "usr-oper", isActive: true },
  { areaId: "MANT", areaName: "Mantenimiento", plantId: "ALT", responsibleUserId: "usr-maint", isActive: true },
  { areaId: "MASH", areaName: "MASH (Medio Ambiente, Seguridad e Higiene)", plantId: "ALT", responsibleUserId: "usr-mash", isActive: true },
  { areaId: "CONT", areaName: "Contraloría", plantId: "CDMX", responsibleUserId: "usr-contralor", isActive: true },
  { areaId: "FIN", areaName: "Finanzas", plantId: "CDMX", responsibleUserId: "usr-director", isActive: true },
  { areaId: "TI", areaName: "Tecnologías de la Información", plantId: "CDMX", responsibleUserId: "usr-admin", isActive: true },
  { areaId: "LOG", areaName: "Logística", plantId: "ALT", responsibleUserId: "usr-leader", isActive: true },
  { areaId: "RH", areaName: "Recursos Humanos", plantId: "CDMX", responsibleUserId: "usr-admin", isActive: true }
];

export const SEED_PROJECT_TYPES = [
  { projectTypeId: "TI", name: "TI (Tecnologías de Información)", description: "Proyectos de software, servidores, redes y telecomunicaciones.", requiresADP: false, requiresMOC: false, requiresPSSR: false, requiresSafetyReview: false, requiresTransmittal: false, requiresElectricalChecklist: false, requiresSAP: true, isActive: true },
  { projectTypeId: "INFRA", name: "Infraestructura civil", description: "Obras civiles, pavimentación, naves industriales y edificios.", requiresADP: true, requiresMOC: true, requiresPSSR: true, requiresSafetyReview: true, requiresTransmittal: true, requiresElectricalChecklist: false, requiresSAP: true, isActive: true },
  { projectTypeId: "PROC", name: "Proceso Industrial", description: "Modificaciones o instalación de líneas de proceso químico/físico.", requiresADP: true, requiresMOC: true, requiresPSSR: true, requiresSafetyReview: true, requiresTransmittal: true, requiresElectricalChecklist: true, requiresSAP: true, isActive: true },
  { projectTypeId: "ELEC", name: "Eléctrico / Instrumentación", description: "Tableros, subestaciones y cableado industrial.", requiresADP: true, requiresMOC: true, requiresPSSR: true, requiresSafetyReview: true, requiresTransmittal: false, requiresElectricalChecklist: true, requiresSAP: true, isActive: true },
  { projectTypeId: "ESG", name: "Sostenibilidad / ESG", description: "Eficiencia energética, manejo de emisiones y reducción de agua.", requiresADP: true, requiresMOC: false, requiresPSSR: false, requiresSafetyReview: true, requiresTransmittal: false, requiresElectricalChecklist: false, requiresSAP: true, isActive: true },
  { projectTypeId: "MANT_MAYOR", name: "Mantenimiento Mayor", description: "Paros de planta y mantenimiento correctivo mayor.", requiresADP: false, requiresMOC: true, requiresPSSR: true, requiresSafetyReview: true, requiresTransmittal: false, requiresElectricalChecklist: false, requiresSAP: true, isActive: true },
  { projectTypeId: "ADMIN", name: "Administrativo", description: "Remodelación de oficinas u otros proyectos de gestión.", requiresADP: false, requiresMOC: false, requiresPSSR: false, requiresSafetyReview: false, requiresTransmittal: false, requiresElectricalChecklist: false, requiresSAP: false, isActive: true }
];

export const SEED_USERS = [
  { userId: "usr-admin", fullName: "Administrador de Sistemas", email: "admin@styropek.com", role: "Admin", department: "TI", areaId: "TI", plantId: "CDMX", position: "Gerente de TI", isActive: true },
  { userId: "usr-director", fullName: "Eduardo Rius (Director CAPEX)", email: "director@styropek.com", role: "Dirección", department: "Finanzas", areaId: "FIN", plantId: "CDMX", position: "Director de Operaciones", isActive: true },
  { userId: "usr-leader", fullName: "Ing. Carlos Mendoza", email: "leader@styropek.com", role: "Líder de Proyecto", department: "Proyectos", areaId: "PROY", plantId: "ALT", position: "Líder de Proyectos Altamira", isActive: true },
  { userId: "usr-requester", fullName: "Lic. Ana Gómez", email: "solicitante@styropek.com", role: "Solicitante", department: "Operaciones", areaId: "OPER", plantId: "ALT", position: "Jefa de Producción", isActive: true },
  { userId: "usr-plan", fullName: "Mtra. Sofía Ruiz", email: "plan@styropek.com", role: "Planeación Estratégica", department: "Planeación", areaId: "PLAN", plantId: "CDMX", position: "Coordinadora de Planeación", isActive: true },
  { userId: "usr-mash", fullName: "Ing. Roberto Martínez", email: "mash@styropek.com", role: "MASH", department: "MASH", areaId: "MASH", plantId: "ALT", position: "Auditor de Seguridad", isActive: true },
  { userId: "usr-contralor", fullName: "C.P. Javier Soto", email: "contraloria@styropek.com", role: "Contraloría", department: "Contraloría", areaId: "CONT", plantId: "CDMX", position: "Contralor Corporativo", isActive: true },
  { userId: "usr-maint", fullName: "Ing. Daniel Torres", email: "mantenimiento@styropek.com", role: "Mantenimiento", department: "Mantenimiento", areaId: "MANT", plantId: "ALT", position: "Jefe de Mantenimiento", isActive: true },
  { userId: "usr-consulta", fullName: "Ing. Laura Pérez", email: "consulta@styropek.com", role: "Consulta", department: "Operaciones", areaId: "OPER", plantId: "ALT", position: "Consultor Técnico", isActive: true }
];

export const SEED_PROJECTS = [
  {
    projectId: "proj-sap-fiori",
    projectCode: "CPX-TI-001",
    projectName: "Actualización de SAP Fiori",
    description: "Migración de portales heredados a la nueva interfaz SAP Fiori 3.0 para líderes de proyecto.",
    site: "Oficinas CDMX",
    plantId: "CDMX",
    businessUnit: "Soporte Operativo",
    areaId: "TI",
    department: "TI",
    costCenter: "CC-TI-101",
    requesterId: "usr-requester",
    projectLeaderId: "usr-leader",
    responsibleUserId: "usr-admin",
    sponsorId: "usr-director",
    projectTypeId: "TI",
    projectSubtype: "Software de Gestión",
    investmentType: "Productividad",
    investmentFocus: "Digitalización",
    status: "Planning",
    currentStage: "ADP-02",
    priority: "Medium",
    riskLevel: "Low",
    estimatedBudgetUSD: 45000,
    approvedBudgetUSD: 45000,
    spentAmountUSD: 12000,
    estimatedStartDate: new Date("2026-07-01"),
    estimatedEndDate: new Date("2026-12-15"),
    actualStartDate: new Date("2026-07-01"),
    actualEndDate: null,
    createdBy: "usr-admin",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    projectId: "proj-waste-warehouse",
    projectCode: "CPX-INF-002",
    projectName: "Almacén de Residuos Altamira",
    description: "Construcción de una nave industrial techada para el confinamiento seguro de residuos peligrosos.",
    site: "Planta Altamira",
    plantId: "ALT",
    businessUnit: "Poliestireno",
    areaId: "MASH",
    department: "MASH",
    costCenter: "CC-MA-202",
    requesterId: "usr-requester",
    projectLeaderId: "usr-leader",
    responsibleUserId: "usr-mash",
    sponsorId: "usr-director",
    projectTypeId: "INFRA",
    projectSubtype: "Almacenamiento / MASH",
    investmentType: "Legal / Cumplimiento",
    investmentFocus: "Seguridad",
    status: "Capitalization",
    currentStage: "ADP-04",
    priority: "High",
    riskLevel: "High",
    estimatedBudgetUSD: 180000,
    approvedBudgetUSD: 195000,
    spentAmountUSD: 194000,
    estimatedStartDate: new Date("2025-08-01"),
    estimatedEndDate: new Date("2026-05-30"),
    actualStartDate: new Date("2025-08-10"),
    actualEndDate: new Date("2026-06-01"),
    createdBy: "usr-leader",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    projectId: "proj-contractor-dining",
    projectCode: "CPX-INF-003",
    projectName: "Comedor de Contratistas",
    description: "Ampliación y remodelación del comedor exterior para contratistas fijos y temporales de la Planta Altamira.",
    site: "Planta Altamira",
    plantId: "ALT",
    businessUnit: "Soporte Planta",
    areaId: "PROY",
    department: "Proyectos",
    costCenter: "CC-PR-303",
    requesterId: "usr-requester",
    projectLeaderId: "usr-leader",
    responsibleUserId: "usr-maint",
    sponsorId: "usr-director",
    projectTypeId: "INFRA",
    projectSubtype: "Servicio al Personal",
    investmentType: "Bienestar",
    investmentFocus: "Ergonomía / MASH",
    status: "In Execution",
    currentStage: "ADP-03",
    priority: "Low",
    riskLevel: "Medium",
    estimatedBudgetUSD: 75000,
    approvedBudgetUSD: 75000,
    spentAmountUSD: 48000,
    estimatedStartDate: new Date("2026-01-15"),
    estimatedEndDate: new Date("2026-08-30"),
    actualStartDate: new Date("2026-02-01"),
    actualEndDate: null,
    createdBy: "usr-leader",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const SEED_INVESTMENT_REQUESTS = [
  {
    investmentRequestId: "req-sap-fiori",
    projectId: "proj-sap-fiori",
    requestName: "Solicitud Fiori 3.0",
    requesterId: "usr-requester",
    areaId: "TI",
    costCenter: "CC-TI-101",
    site: "Oficinas CDMX",
    background: "La interfaz SAP actual es obsoleta, lenta y requiere entrenamiento complejo.",
    scopeDescription: "Migración de los módulos de aprobación de compras, solicitudes de viáticos y visualización de KPIs.",
    objectives: "Mejorar la experiencia del usuario directivo y reducir tiempos de aprobación de compras de 4 días a 1 día.",
    expectedBenefits: "Ahorro de horas hombre en procesos y habilitación de aprobaciones móviles.",
    estimatedSavingsUSD: 15000,
    timeReductionHours: 48,
    involvesFixedAssetReplacement: false,
    status: "Approved",
    submittedAt: new Date("2026-05-10"),
    approvedAt: new Date("2026-05-20"),
    createdAt: new Date()
  },
  {
    investmentRequestId: "req-waste-warehouse",
    projectId: "proj-waste-warehouse",
    requestName: "Solicitud Almacén Residuos",
    requesterId: "usr-requester",
    areaId: "MASH",
    costCenter: "CC-MA-202",
    site: "Planta Altamira",
    background: "Auditoría ambiental identificó que el almacenamiento temporal actual incumple la NOM-052-SEMARNAT.",
    scopeDescription: "Nave techada de 300 m2 con fosas de contención para derrames e iluminación a prueba de explosión.",
    objectives: "Evitar multas regulatorias y brindar contención a riesgos ambientales por lluvias torrenciales.",
    expectedBenefits: "Cumplimiento legal total y reducción del riesgo de filtraciones en suelo.",
    safetyContribution: "Excelente control de químicos y materiales reactivos.",
    sustainabilityContribution: "Evita contaminación de mantos acuíferos.",
    estimatedSavingsUSD: 0,
    timeReductionHours: 0,
    involvesFixedAssetReplacement: false,
    status: "Approved",
    submittedAt: new Date("2025-06-01"),
    approvedAt: new Date("2025-06-15"),
    createdAt: new Date()
  },
  {
    investmentRequestId: "req-contractor-dining",
    projectId: "proj-contractor-dining",
    requestName: "Solicitud Comedor Contratistas",
    requesterId: "usr-requester",
    areaId: "PROY",
    costCenter: "CC-PR-303",
    site: "Planta Altamira",
    background: "El aforo de contratistas aumentó un 40% debido a expansiones y el comedor actual está rebasado.",
    scopeDescription: "Ampliar estructura metálica, instalar mesas adicionales, y aire acondicionado.",
    objectives: "Habilitar comedor digno con capacidad para 80 comensales simultáneos.",
    expectedBenefits: "Satisfacción laboral del personal externo y reducción de incidentes por calor en horas de comida.",
    safetyContribution: "Espacio ergonómico e hidratado.",
    estimatedSavingsUSD: 0,
    timeReductionHours: 0,
    involvesFixedAssetReplacement: false,
    status: "Approved",
    submittedAt: new Date("2025-11-01"),
    approvedAt: new Date("2025-11-20"),
    createdAt: new Date()
  }
];

export const SEED_ADPS = [
  {
    adpId: "adp-sap-fiori",
    projectId: "proj-sap-fiori",
    version: 1,
    projectBackground: "Migración técnica de interfaces.",
    projectObjective: "Implementar SAP Fiori 3.0.",
    deliverableScope: "Dashboard funcional en producción y 100 usuarios habilitados.",
    criticalVariables: "Compatibilidad con navegadores móviles y performance de base SAP.",
    requiresSafetyReview1And2: false,
    requiresPSSR: false,
    requiresMOCOperational: false,
    requiresMOCAdministrative: false,
    requiresBasicEngineering: false,
    requiresDetailEngineering: false,
    estimatedDurationMonths: 5.5,
    status: "Approved",
    approvedAt: new Date("2026-06-05"),
    createdAt: new Date()
  },
  {
    adpId: "adp-waste-warehouse",
    projectId: "proj-waste-warehouse",
    version: 1,
    projectBackground: "Incumplimiento NOM-052-SEMARNAT.",
    projectObjective: "Construir almacén seguro de residuos peligrosos.",
    deliverableScope: "Nave techada con dictamen aprobatorio de protección civil y MASH.",
    criticalVariables: "Hermeticidad del piso, resistencia de muros cortafuegos.",
    requiresSafetyReview1And2: true,
    safetyReviewReason: "Manejo de residuos inflamables y corrosivos en planta.",
    requiresPSSR: true,
    pssrReason: "Validar sistemas contra incendio antes de arrancar operaciones de confinamiento.",
    requiresMOCOperational: true,
    mocOperationalReason: "Modificación física de rutas de almacenamiento.",
    requiresMOCAdministrative: false,
    requiresBasicEngineering: true,
    requiresDetailEngineering: true,
    requiresMaintenanceDocumentation: true,
    estimatedDurationMonths: 10,
    status: "Approved",
    approvedAt: new Date("2025-07-20"),
    createdAt: new Date()
  },
  {
    adpId: "adp-contractor-dining",
    projectId: "proj-contractor-dining",
    version: 1,
    projectBackground: "Hacinamiento en horarios de comida.",
    projectObjective: "Ampliar y remodelar comedor de contratistas.",
    deliverableScope: "Estructura ampliada, mesas, instalaciones eléctricas y climas operacionales.",
    criticalVariables: "Carga eléctrica del sistema HVAC y resistencia al viento de la estructura techada.",
    requiresSafetyReview1And2: true,
    safetyReviewReason: "Trabajos de soldadura y alturas en zonas adyacentes a planta.",
    requiresPSSR: false,
    requiresMOCOperational: false,
    requiresMOCAdministrative: false,
    requiresBasicEngineering: false,
    requiresDetailEngineering: true,
    estimatedDurationMonths: 7,
    status: "Approved",
    approvedAt: new Date("2025-12-10"),
    createdAt: new Date()
  }
];

export const SEED_ACTION_ITEMS = [
  {
    actionId: "act-101",
    projectId: "proj-contractor-dining",
    sourceModule: "PROJECT",
    title: "Obtención de permisos de soldadura y flama abierta",
    description: "Tramitar permisos MASH para trabajos en caliente requeridos en la ampliación del techo.",
    responsibleUserId: "usr-leader",
    dueDate: new Date("2026-03-01"),
    status: "Completed",
    priority: "High",
    evidenceRequired: true,
    evidenceId: "doc-evidence-permit",
    createdBy: "usr-mash",
    createdAt: new Date()
  },
  {
    actionId: "act-102",
    projectId: "proj-contractor-dining",
    sourceModule: "PROJECT",
    title: "Cargar dictamen eléctrico de climas",
    description: "Presentar revisión eléctrica de los cargadores e interruptores instalados para los aires acondicionados.",
    responsibleUserId: "usr-maint",
    dueDate: new Date("2026-08-15"),
    status: "Open",
    priority: "Medium",
    evidenceRequired: true,
    evidenceId: null,
    createdBy: "usr-leader",
    createdAt: new Date()
  }
];

export const SEED_DOCUMENTS = [
  {
    documentId: "doc-evidence-permit",
    projectId: "proj-contractor-dining",
    documentType: "Evidencia",
    fileName: "Permiso_Trabajo_Caliente_Firmado.pdf",
    fileUrl: "https://firebasestorage.googleapis.com/v0/b/styropek-project-lifecycle-hub.appspot.com/o/projects%2Fproj-contractor-dining%2Fevidences%2FPermiso_Trabajo_Caliente_Firmado.pdf?alt=media",
    storagePath: "projects/proj-contractor-dining/evidences/Permiso_Trabajo_Caliente_Firmado.pdf",
    fileExtension: "pdf",
    fileSize: 450000,
    version: 1,
    uploadedBy: "usr-leader",
    uploadedAt: new Date(),
    status: "Approved",
    tags: ["MASH", "Seguridad", "Caliente"],
    relatedModule: "ACTION_ITEM",
    requiresApproval: true,
    approvedAt: new Date(),
    createdAt: new Date()
  }
];

export const SEED_RISKS = [
  {
    riskId: "risk-201",
    projectId: "proj-waste-warehouse",
    riskCategory: "MASH / Ambiental",
    description: "Derrame accidental de líquidos reactivos durante maniobras de reubicación temporal.",
    probability: 2,
    impact: 5,
    riskLevel: "High",
    mitigationPlan: "Colocar charolas de contención plástica y diques en todas las salidas del almacén temporal.",
    responsibleUserId: "usr-mash",
    status: "Mitigated",
    createdAt: new Date()
  }
];

/**
 * Seeds all collection with dummy objects in a writeBatch.
 */
export async function seedDatabase() {
  try {
    // 1. Check if we already have projects seeded to prevent duplicates
    const checkSnapshot = await getDocs(collection(db, "projects"));
    if (!checkSnapshot.empty) {
      console.log("Database already has data. Skipping seed.");
      return "skipped";
    }

    const batch = writeBatch(db);

    // Seed Plants
    SEED_PLANTS.forEach((plant) => {
      const docRef = doc(db, "plants", plant.plantId);
      batch.set(docRef, plant);
    });

    // Seed Areas
    SEED_AREAS.forEach((area) => {
      const docRef = doc(db, "areas", area.areaId);
      batch.set(docRef, area);
    });

    // Seed Project Types
    SEED_PROJECT_TYPES.forEach((type) => {
      const docRef = doc(db, "projectTypes", type.projectTypeId);
      batch.set(docRef, type);
    });

    // Seed Users
    SEED_USERS.forEach((user) => {
      const docRef = doc(db, "users", user.userId);
      batch.set(docRef, user);
    });

    // Seed Projects
    SEED_PROJECTS.forEach((proj) => {
      const docRef = doc(db, "projects", proj.projectId);
      batch.set(docRef, proj);
    });

    // Seed Investment Requests
    SEED_INVESTMENT_REQUESTS.forEach((req) => {
      const docRef = doc(db, "investmentRequests", req.investmentRequestId);
      batch.set(docRef, req);
    });

    // Seed ADPs
    SEED_ADPS.forEach((adp) => {
      const docRef = doc(db, "adps", adp.adpId);
      batch.set(docRef, adp);
    });

    // Seed Action Items
    SEED_ACTION_ITEMS.forEach((act) => {
      const docRef = doc(db, "actionItems", act.actionId);
      batch.set(docRef, act);
    });

    // Seed Documents
    SEED_DOCUMENTS.forEach((docItem) => {
      const docRef = doc(db, "documents", docItem.documentId);
      batch.set(docRef, docItem);
    });

    // Seed Risks
    SEED_RISKS.forEach((risk) => {
      const docRef = doc(db, "risks", risk.riskId);
      batch.set(docRef, risk);
    });

    await batch.commit();
    console.log("Database seeded successfully!");
    return "success";
  } catch (error) {
    console.error("Failed to seed database:", error);
    throw error;
  }
}
