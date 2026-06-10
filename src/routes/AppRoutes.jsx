import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Portfolio from "../pages/Portfolio";
import CreateProject from "../pages/CreateProject";
import Project360 from "../pages/Project360";
import ADPForm from "../pages/ADPForm";
import InvestmentRequestForm from "../pages/InvestmentRequestForm";
import Admin from "../pages/Admin";
// Placeholder pages
import InvestmentRequests from "../pages/InvestmentRequests";
import ADPList from "../pages/ADPList";
import Approvals from "../pages/Approvals";
import ActionsPage from "../pages/ActionsPage";
import RisksPage from "../pages/RisksPage";
import DocumentsPage from "../pages/DocumentsPage";
import ReportsPage from "../pages/ReportsPage";
import { useAuth } from "../hooks/useAuth";
import LoadingState from "../components/ui/LoadingState";

// Component to protect routes based on role permissions
function ProtectedRoute({ children, permission }) {
  const { isAuthenticated, hasPermission, loading } = useAuth();
  // Show loading spinner while auth state is being determined
  if (loading) {
    return <LoadingState message="Cargando entorno empresarial..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Permission check if a permission prop is provided
  if (permission && !hasPermission(permission)) {
    return <Navigate to="/" replace />;
  }

  // Allow access even if profile is null, as long as user is authenticated
  return children ? children : <Outlet />;
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Login Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard and Dossier routes */}
        <Route path="/" element={<AppLayout />}>
          <Route
            index
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
          <Route path="investment-requests" element={<ProtectedRoute><InvestmentRequests /></ProtectedRoute>} />
          <Route path="adp" element={<ProtectedRoute><ADPList /></ProtectedRoute>} />
          <Route path="approvals" element={<ProtectedRoute><Approvals /></ProtectedRoute>} />
          <Route path="actions" element={<ProtectedRoute><ActionsPage /></ProtectedRoute>} />
          <Route path="risks" element={<ProtectedRoute><RisksPage /></ProtectedRoute>} />
          <Route path="documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
          <Route path="reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
          <Route path="admin" element={<ProtectedRoute permission="canManageUsers"><Admin /></ProtectedRoute>} />
          <Route path="create-project" element={<ProtectedRoute permission="canCreateProject"><CreateProject /></ProtectedRoute>} />
          <Route path="project/:id" element={<ProtectedRoute><Outlet /></ProtectedRoute>} >
            <Route index element={<Project360 />} />
            <Route path="investment-request" element={<InvestmentRequestForm />} />
            <Route path="adp" element={<ADPForm />} />
          </Route>
        </Route>

        {/* Fallback to Dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default AppRoutes;
