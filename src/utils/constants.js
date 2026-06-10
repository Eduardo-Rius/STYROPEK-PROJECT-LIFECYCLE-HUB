export const STAGES = {
  ADP_01: {
    id: "ADP-01",
    label: "ADP-01 Generar Proyecto",
    description: "Creación, evaluación inicial, factibilidad, riesgos, anteproyecto y alcance."
  },
  ADP_02: {
    id: "ADP-02",
    label: "ADP-02 Planear Proyecto",
    description: "Ingeniería básica, estimación de costos, cronograma, FDD / SAI y alta en SAP."
  },
  ADP_03: {
    id: "ADP-03",
    label: "ADP-03 Ejecutar Proyecto",
    description: "Ingeniería de detalle, compras, ejecución en campo, seguimiento, control de avance y cambios."
  },
  ADP_04: {
    id: "ADP-04",
    label: "ADP-04 Concluir Proyecto",
    description: "Comisionamiento, cierre, capitalización, transmittal, actas y expediente final."
  }
};

export const PROJECT_STATES = {
  DRAFT: {
    id: "Draft",
    label: "Draft",
    description: "Borrador de propuesta o solicitud de inversión en preparación.",
    color: "gray",
    stage: "ADP-01"
  },
  UNDER_REVIEW: {
    id: "Under Review",
    label: "Bajo Revisión",
    description: "Evaluación inicial por parte de la Dirección y Planeación.",
    color: "blue",
    stage: "ADP-01"
  },
  FEASIBILITY: {
    id: "Feasibility",
    label: "Factibilidad",
    description: "Análisis de viabilidad técnica, económica y de seguridad (MASH).",
    color: "cyan",
    stage: "ADP-01"
  },
  SCOPE_APPROVED: {
    id: "Scope Approved",
    label: "Alcance Aprobado",
    description: "Aprobación de la viabilidad e inicio de la ingeniería básica.",
    color: "indigo",
    stage: "ADP-01"
  },
  PLANNING: {
    id: "Planning",
    label: "Planeación",
    description: "Diseño del plan de proyecto, cronograma, estimación de costos y FDD.",
    color: "purple",
    stage: "ADP-02"
  },
  PENDING_APPROVAL: {
    id: "Pending Approval",
    label: "Aprobación Pendiente",
    description: "Esperando aprobación de la solicitud de inversión/ADP final.",
    color: "amber",
    stage: "ADP-02"
  },
  APPROVED: {
    id: "Approved",
    label: "Aprobado",
    description: "Proyecto aprobado financieramente y listo para ejecución.",
    color: "emerald",
    stage: "ADP-02"
  },
  IN_EXECUTION: {
    id: "In Execution",
    label: "En Ejecución",
    description: "Ingeniería de detalle, compras y obras en campo.",
    color: "blue",
    stage: "ADP-03"
  },
  COMMISSIONING: {
    id: "Commissioning",
    label: "Comisionamiento",
    description: "Pruebas de arranque de equipos e instalaciones.",
    color: "teal",
    stage: "ADP-04"
  },
  PSSR: {
    id: "PSSR",
    label: "Revisión de Seguridad Pre-Arranque",
    description: "Pre-Start Safety Review obligatoria aprobada.",
    color: "orange",
    stage: "ADP-04"
  },
  CAPITALIZATION: {
    id: "Capitalization",
    label: "Capitalización",
    description: "Cierre contable y alta de activos fijos.",
    color: "yellow",
    stage: "ADP-04"
  },
  CLOSED: {
    id: "Closed",
    label: "Cerrado",
    description: "Cierre total del proyecto y expediente digital completo.",
    color: "green",
    stage: "ADP-04"
  },
  CANCELLED: {
    id: "Cancelled",
    label: "Cancelado",
    description: "Proyecto cancelado por inviabilidad o decisión directiva.",
    color: "rose",
    stage: "ADP-04"
  }
};

export const ROLES = {
  ADMIN: "Admin",
  DIRECCION: "Dirección",
  LIDER_PROYECTO: "Líder de Proyecto",
  SOLICITANTE: "Solicitante",
  PLANEACION: "Planeación Estratégica",
  MASH: "MASH",
  CONTRALORIA: "Contraloría",
  MANTENIMIENTO: "Mantenimiento",
  CONSULTA: "Consulta"
};

export const ACTION_STATUS = {
  OPEN: "Open",
  IN_PROGRESS: "In Progress",
  WAITING_EVIDENCE: "Waiting Evidence",
  COMPLETED: "Completed",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled"
};

export const APPROVAL_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  DELEGATED: "Delegated",
  CANCELLED: "Cancelled"
};

export const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
  "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
  "image/png",
  "image/jpeg",
  "image/jpg"
];

export const ALLOWED_FILE_EXTENSIONS = ["pdf", "docx", "xlsx", "pptx", "png", "jpg", "jpeg"];
