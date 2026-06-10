// src/components/ui/Breadcrumbs.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home } from "lucide-react";

export function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  // Build breadcrumb items
  const breadcrumbs = parts.map((part, index) => {
    const path = "/" + parts.slice(0, index + 1).join("/");
    // Convert kebab or slug to readable label
    const label = part
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return { label, path };
  });

  return (
    <nav className="flex items-center space-x-2 py-3 text-sm text-industrial-500">
      <Link to="/" className="flex items-center gap-1 hover:text-industrial-700">
        <Home className="w-4 h-4" />
        <span>Dashboard</span>
      </Link>
      {breadcrumbs.map((crumb, idx) => (
        <React.Fragment key={crumb.path}>
          <span>{"/"}</span>
          {idx === breadcrumbs.length - 1 ? (
            <span className="font-medium text-industrial-800">{crumb.label}</span>
          ) : (
            <Link
              to={crumb.path}
              className="hover:text-industrial-700"
            >
              {crumb.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export default Breadcrumbs;
