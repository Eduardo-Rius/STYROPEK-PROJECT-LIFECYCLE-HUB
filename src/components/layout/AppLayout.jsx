import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Breadcrumbs from "../ui/Breadcrumbs";
import { useAuth } from "../../hooks/useAuth";
import LoadingState from "../ui/LoadingState";

export function AppLayout() {
  const { isAuthenticated, loading } = useAuth();

  // If session state is still loading, display a spinner
  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-industrial-50">
        <LoadingState message="Cargando entorno empresarial..." />
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-industrial-50 font-sans">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <Breadcrumbs />
        <main className="flex-1 overflow-y-auto p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default AppLayout;
