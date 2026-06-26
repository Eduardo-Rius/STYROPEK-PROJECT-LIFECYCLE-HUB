import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useProjects } from "../../hooks/useProjects";
import RoleBadge from "../ui/RoleBadge";
import { Search, Menu, Bell, User } from "lucide-react";

export function Topbar({ onMenuToggle }) {
  // All hooks must be declared before any conditional return
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const { projects } = useProjects();

  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const debounceTimer = useRef(null);

  // Search effect – defines a single const filtered inside
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!searchTerm) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    debounceTimer.current = setTimeout(() => {
      const lower = searchTerm.toLowerCase();
      const filtered = projects
        .filter(p =>
          (p.projectCode && p.projectCode.toLowerCase().includes(lower)) ||
          (p.projectName && p.projectName.toLowerCase().includes(lower)) ||
          (p.site && p.site.toLowerCase().includes(lower)) ||
          (p.plantName && p.plantName.toLowerCase().includes(lower))
        )
        .slice(0, 5);
      setResults(filtered);
      setShowDropdown(filtered.length > 0);
    }, 300);
    return () => clearTimeout(debounceTimer.current);
  }, [searchTerm, projects]);

  // Guard – render nothing until profile is loaded
  if (!profile) return null;

  const handleSelect = projectId => {
    setSearchTerm("");
    setResults([]);
    setShowDropdown(false);
    navigate(`/project/${projectId}`);
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && results.length) {
      handleSelect(results[0].projectId);
    }
  };

  return (
    <header className="h-16 border-b border-industrial-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button onClick={onMenuToggle} className="lg:hidden p-2 text-industrial-500 hover:bg-industrial-50 rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative w-full max-w-sm hidden sm:block">
          <span className="absolute inset-y-0 left-3 flex items-center text-industrial-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Buscar proyectos, folios, evidencias..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-10 pr-4 py-1.5 text-xs border border-industrial-200 rounded-lg bg-industrial-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
          />
          {showDropdown && (
            <ul className="absolute left-0 right-0 top-full mt-1 bg-white border border-industrial-200 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
              {results.map(p => (
                <li
                  key={p.projectId}
                  onClick={() => handleSelect(p.projectId)}
                  className="px-3 py-2 text-xs cursor-pointer hover:bg-industrial-100"
                >
                  {p.projectCode} – {p.projectName}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <button className="p-2 rounded-lg text-industrial-500 hover:text-brand-600 hover:bg-industrial-50 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-brand-500" />
        </button>
        <div className="h-6 w-px bg-industrial-200 mx-1" />
        <div className="relative flex items-center gap-3">
          <div
            className="hidden md:flex flex-col items-end cursor-pointer"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <p className="text-xs font-semibold text-industrial-900 leading-none">{profile.fullName}</p>
            <RoleBadge role={profile.role} className="ml-2" />
            <p className="text-[10px] text-industrial-400 mt-1 uppercase tracking-wider">
              {profile.department || "Operaciones"}
            </p>
          </div>
          <div
            className="w-8 h-8 rounded-full bg-industrial-100 border border-industrial-200 flex items-center justify-center text-industrial-600 cursor-pointer"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <User className="w-4 h-4" />
          </div>
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white/90 backdrop-blur-md border border-industrial-200 rounded shadow-lg z-20">
              <button
                onClick={() => navigate('/profile')}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-industrial-100"
              >
                Mi Perfil
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-industrial-100"
              >
                Configuración
              </button>
              <button
                onClick={async () => {
                  await logout();
                  navigate('/login', { replace: true });
                }}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-industrial-100 text-danger"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
