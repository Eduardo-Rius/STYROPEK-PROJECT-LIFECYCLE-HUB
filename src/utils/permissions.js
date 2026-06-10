import { ROLES } from "./constants";

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: {
    canViewDashboard: true,
    canCreateProject: true,
    canEditProject: true,
    canDeleteProject: true,
    canApprove: true,
    canUploadDocuments: true,
    canManageActions: true,
    canViewFinancials: true,
    canManageUsers: true,
    canViewAuditLog: true,
    canUseAI: true
  },
  [ROLES.DIRECCION]: {
    canViewDashboard: true,
    canCreateProject: false,
    canEditProject: true,
    canDeleteProject: false,
    canApprove: true,
    canUploadDocuments: true,
    canManageActions: true,
    canViewFinancials: true,
    canManageUsers: false,
    canViewAuditLog: true,
    canUseAI: true
  },
  [ROLES.LIDER_PROYECTO]: {
    canViewDashboard: true,
    canCreateProject: true,
    canEditProject: true,
    canDeleteProject: false,
    canApprove: false,
    canUploadDocuments: true,
    canManageActions: true,
    canViewFinancials: true,
    canManageUsers: false,
    canViewAuditLog: false,
    canUseAI: true
  },
  [ROLES.SOLICITANTE]: {
    canViewDashboard: true,
    canCreateProject: true,
    canEditProject: true,
    canDeleteProject: false,
    canApprove: false,
    canUploadDocuments: true,
    canManageActions: false,
    canViewFinancials: false,
    canManageUsers: false,
    canViewAuditLog: false,
    canUseAI: true
  },
  [ROLES.PLANEACION]: {
    canViewDashboard: true,
    canCreateProject: false,
    canEditProject: true,
    canDeleteProject: false,
    canApprove: true,
    canUploadDocuments: true,
    canManageActions: true,
    canViewFinancials: true,
    canManageUsers: false,
    canViewAuditLog: true,
    canUseAI: true
  },
  [ROLES.MASH]: {
    canViewDashboard: true,
    canCreateProject: false,
    canEditProject: true,
    canDeleteProject: false,
    canApprove: true, // Only safety-related approvals
    canUploadDocuments: true,
    canManageActions: true,
    canViewFinancials: false,
    canManageUsers: false,
    canViewAuditLog: false,
    canUseAI: false
  },
  [ROLES.CONTRALORIA]: {
    canViewDashboard: true,
    canCreateProject: false,
    canEditProject: false,
    canDeleteProject: false,
    canApprove: true, // Budget and Capex allocations
    canUploadDocuments: true,
    canManageActions: false,
    canViewFinancials: true,
    canManageUsers: false,
    canViewAuditLog: true,
    canUseAI: false
  },
  [ROLES.MANTENIMIENTO]: {
    canViewDashboard: true,
    canCreateProject: false,
    canEditProject: false,
    canDeleteProject: false,
    canApprove: false,
    canUploadDocuments: true,
    canManageActions: true,
    canViewFinancials: false,
    canManageUsers: false,
    canViewAuditLog: false,
    canUseAI: false
  },
  [ROLES.CONSULTA]: {
    canViewDashboard: true,
    canCreateProject: false,
    canEditProject: false,
    canDeleteProject: false,
    canApprove: false,
    canUploadDocuments: false,
    canManageActions: false,
    canViewFinancials: false,
    canManageUsers: false,
    canViewAuditLog: false,
    canUseAI: false
  }
};

/**
 * Check if a role is authorized to perform a permission action.
 * @param {string} role - The user's role.
 * @param {string} permission - The permission name to check.
 * @returns {boolean} Whether permission is granted.
 */
export function hasPermission(role, permission) {
  if (!role || !permission) return false;
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return !!permissions[permission];
}
