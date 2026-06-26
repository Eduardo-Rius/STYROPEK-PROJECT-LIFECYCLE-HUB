import React from "react";
import { useAuth } from "../../hooks/useAuth";

/**
 * SessionInfoCard displays current user session details.
 */
export function SessionInfoCard() {
  const { profile } = useAuth();
  if (!profile) return null;
  return (
    <div className="glass-panel p-4 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
      <h3 className="text-sm font-semibold text-white mb-2">Sesión Actual</h3>
      <p className="text-xs text-white/80">Nombre: {profile.fullName}</p>
      <p className="text-xs text-white/80">Rol: {profile.role}</p>
      <p className="text-xs text-white/80">Área: {profile.areaId || profile.area || "-"}</p>
      <p className="text-xs text-white/80">Correo: {profile.email}</p>
    </div>
  );
}
export default SessionInfoCard;
