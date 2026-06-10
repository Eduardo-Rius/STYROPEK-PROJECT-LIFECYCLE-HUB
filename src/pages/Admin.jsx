import React from "react";
import PageHeader from "../components/ui/PageHeader";
import RoleBadge from "../components/ui/RoleBadge";
import { SEED_USERS } from "../data/seedData";
import { ROLE_PERMISSIONS } from "../utils/permissions";

export function Admin() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Panel de Administración"
        description="Gestiona usuarios corporativos, visualiza roles y audita la matriz de permisos de seguridad."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-4">
          <h3 className="text-base font-bold text-industrial-950 font-heading">
            Usuarios Demo Habilitados
          </h3>
          <p className="text-xs text-industrial-400 mt-1">Este listado representa los perfiles simulados del corporativo Styropek.</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans text-industrial-600">
              <thead className="bg-industrial-50 text-[10px] font-bold text-industrial-500 uppercase border-b border-industrial-100">
                <tr>
                  <th className="px-4 py-3">Nombre</th>
                  <th className="px-4 py-3">Correo</th>
                  <th className="px-4 py-3">Departamento</th>
                  <th className="px-4 py-3">Rol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-industrial-100">
                {SEED_USERS.map((u) => (
                  <tr key={u.userId}>
                    <td className="px-4 py-3 font-semibold text-industrial-900">{u.fullName}</td>
                    <td className="px-4 py-3 font-mono">{u.email}</td>
                    <td className="px-4 py-3">{u.department || "N/A"}</td>
                    <td className="px-4 py-3">
                      <RoleBadge role={u.role} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-4">
          <h3 className="text-base font-bold text-industrial-950 font-heading">
            Matriz de Permisos RBAC
          </h3>
          <p className="text-xs text-industrial-500 leading-relaxed">
            La seguridad en el Hub está regida por roles predefinidos en `src/utils/permissions.js`. Los permisos controlan de forma dinámica qué botones, pestañas y llamadas a la base de datos se habilitan para cada usuario.
          </p>

          <div className="space-y-3 pt-2">
            <div className="p-3 bg-industrial-50 border border-industrial-200 rounded-lg text-[10px] text-industrial-700">
              <span className="font-bold uppercase block mb-1">Roles de Negocio</span>
              <ul className="list-disc pl-4 space-y-1">
                <li>**Admin**: Control completo de catálogos y usuarios.</li>
                <li>**Dirección**: Aprobaciones finales y reportes de CAPEX.</li>
                <li>**Líder de Proyecto**: Genera, edita y ejecuta expedientes.</li>
                <li>**MASH**: Audita hitos de seguridad, riesgos y PSSR.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Admin;
