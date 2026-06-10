import { useState, useEffect, useCallback } from "react";
import { getProjects } from "../services/projectService";

/**
 * Hook for loading and managing the portfolio list of projects.
 * @param {Object} initialFilters 
 */
export function useProjects(initialFilters = {}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchProjects = useCallback(async (currentFilters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects(currentFilters);
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
      setError(err.message || "Error al cargar los proyectos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects(filters);
  }, [filters, fetchProjects]);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const refresh = useCallback(() => {
    fetchProjects(filters);
  }, [filters, fetchProjects]);

  return {
    projects,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    refresh
  };
}
export default useProjects;
