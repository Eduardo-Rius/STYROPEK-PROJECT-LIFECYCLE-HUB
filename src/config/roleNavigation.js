export const ROLE_NAVIGATION = {
  "Admin": [
    "/",
    "/portfolio",
    "/investment-requests",
    "/adp",
    "/approvals",
    "/actions",
    "/risks",
    "/documents",
    "/reports",
    "/create-project",
    "/admin"
  ],
  "Dirección": [
    "/",
    "/portfolio",
    "/investment-requests",
    "/adp",
    "/approvals",
    "/risks",
    "/documents",
    "/reports"
  ],
  "Líder de Proyecto": [
    "/",
    "/portfolio",
    "/investment-requests",
    "/adp",
    "/approvals",
    "/actions",
    "/risks",
    "/documents",
    "/reports",
    "/create-project"
  ],
  "Solicitante": [
    "/",
    "/investment-requests",
    "/documents",
    "/reports",
    "/create-project"
  ],
  "Planeación Estratégica": [
    "/",
    "/portfolio",
    "/investment-requests",
    "/adp",
    "/risks",
    "/reports",
    "/documents"
  ],
  "MASH": [
    "/",
    "/portfolio",
    "/risks",
    "/actions",
    "/documents",
    "/reports"
  ],
  "Contraloría": [
    "/",
    "/portfolio",
    "/investment-requests",
    "/adp",
    "/approvals",
    "/reports",
    "/documents"
  ],
  "Mantenimiento": [
    "/",
    "/portfolio",
    "/actions",
    "/risks",
    "/documents",
    "/reports",
    "/adp"
  ],
  "Consulta": [
    "/",
    "/portfolio",
    "/documents",
    "/reports"
  ]
};

export const getAllowedPathsForRole = (role) => {
  // If no role or unknown role, default to 'Consulta'
  if (!role || !ROLE_NAVIGATION[role]) {
    // If it's literally Admin role but maybe named differently, fallback
    if (role && (role.toLowerCase() === 'admin' || role.toLowerCase() === 'administrador')) {
        return ROLE_NAVIGATION["Admin"];
    }
    return ROLE_NAVIGATION["Consulta"];
  }
  return ROLE_NAVIGATION[role];
};
