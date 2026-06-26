import React from "react";
import { useNavigate } from "react-router-dom";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  FileSearch,
  BarChart2,
  CheckCircle,
  Bolt,
  AlertTriangle,
  FileText,
  BarChart3,
  FilePlus2,
  ShieldCheck,
  LogOut
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import RoleBadge from "../ui/RoleBadge";
import styropekLogo from "../../assets/styropek-logo.webp";
import { getAllowedPathsForRole } from "../../config/roleNavigation";

export function Sidebar() {
  const navigate = useNavigate();
  const { profile, logout, hasPermission } = useAuth();
  const location = useLocation();

  const allowedPaths = getAllowedPathsForRole(profile?.role);

  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: <LayoutDashboard className="w-5 h-5" />,
      show: true
    },
    {
      path: "/portfolio",
      label: "Portafolio CAPEX",
      icon: <FolderKanban className="w-5 h-5" />,
      show: true
    },
    {
      path: "/investment-requests",
      label: "Solicitudes de Inversión",
      icon: <FileSearch className="w-5 h-5" />,
      show: true
    },
    {
      path: "/adp",
      label: "ADP",
      icon: <BarChart2 className="w-5 h-5" />,
      show: true
    },
    {
      path: "/approvals",
      label: "Aprobaciones",
      icon: <CheckCircle className="w-5 h-5" />,
      show: true
    },
    {
      path: "/actions",
      label: "Acciones",
      icon: <Bolt className="w-5 h-5" />,
      show: true
    },
    {
      path: "/risks",
      label: "Riesgos",
      icon: <AlertTriangle className="w-5 h-5" />,
      show: true
    },
    {
      path: "/documents",
      label: "Documentos",
      icon: <FileText className="w-5 h-5" />,
      show: true
    },
    {
      path: "/reports",
      label: "Reportes",
      icon: <BarChart3 className="w-5 h-5" />,
      show: true
    },
    {
      path: "/create-project",
      label: "Generar Proyecto",
      icon: <FilePlus2 className="w-5 h-5" />,
      show: hasPermission("canCreateProject")
    },
    {
      path: "/admin",
      label: "Administración",
      icon: <ShieldCheck className="w-5 h-5" />,
      show: hasPermission("canManageUsers")
    }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.show && allowedPaths.includes(item.path)
  );
  const activeClass = "bg-brand-50 text-brand-700 border-l-4 border-brand-600 font-semibold";
  const inactiveClass = "text-industrial-600 hover:bg-industrial-100 hover:text-industrial-900 border-l-4 border-transparent";

  return (
    <aside className="w-64 border-r border-industrial-200 bg-white flex flex-col shrink-0 h-screen sticky top-0">
      {/* Brand Logo */}
      <div className="p-6 border-b border-industrial-100">
        <div className="flex items-center gap-2">
          <img src={styropekLogo} alt="Styropek Logo" className="h-7 object-contain" />
          <span className="font-bold text-sm text-industrial-950 font-heading tracking-tight leading-none">
            Lifecycle Hub
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200 ${
                isActive ? activeClass : inactiveClass
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User profile footer */}
      {profile && (
        <div className="p-4 border-t border-industrial-100 bg-industrial-50/50 flex flex-col gap-2">
          <p className="text-xs font-semibold text-industrial-800 mb-2">Sesión Actual</p>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-industrial-800 truncate font-heading">
                {profile.fullName}
              </p>
              <p className="text-[10px] text-industrial-400 mt-1 truncate">
                {profile.email}
              </p>
              <p className="text-[10px] text-industrial-400 mt-1 truncate">
                Área: {profile.areaId || profile.area || ''}
              </p>
          </div>
          
          <div className="flex items-center justify-between gap-2 mt-1">
            <RoleBadge role={profile.role} />
            
            <button
              onClick={async () => { await logout(); navigate('/login', { replace: true }); }}
              title="Cerrar sesión"
              className="p-1.5 rounded-lg text-industrial-400 hover:text-danger hover:bg-rose-50 transition-smooth"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
export default Sidebar;
