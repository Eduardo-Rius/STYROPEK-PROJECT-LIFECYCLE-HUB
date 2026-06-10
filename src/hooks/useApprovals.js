import { useState, useEffect, useCallback } from "react";
import { 
  getApprovalsByProject, 
  requestApproval, 
  approve, 
  reject 
} from "../services/approvalService";

/**
 * Hook for managing project approvals.
 * @param {string} projectId 
 */
export function useApprovals(projectId) {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApprovals = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getApprovalsByProject(projectId);
      setApprovals(data);
    } catch (err) {
      console.error("Failed to fetch approvals:", err);
      setError(err.message || "Error al cargar las aprobaciones");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const requestNewApproval = async (approvalData, initiatorId) => {
    setError(null);
    try {
      await requestApproval({ ...approvalData, projectId }, initiatorId);
      await fetchApprovals();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const approveRequest = async (approvalId, comments, approverId) => {
    setError(null);
    try {
      await approve(approvalId, comments, approverId);
      await fetchApprovals();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const rejectRequest = async (approvalId, comments, approverId) => {
    setError(null);
    try {
      await reject(approvalId, comments, approverId);
      await fetchApprovals();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    approvals,
    loading,
    error,
    requestNewApproval,
    approveRequest,
    rejectRequest,
    refresh: fetchApprovals
  };
}
export default useApprovals;
