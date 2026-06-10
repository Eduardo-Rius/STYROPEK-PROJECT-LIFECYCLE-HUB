import { useState, useEffect, useCallback } from "react";
import { getProjectById } from "../services/projectService";
import { getInvestmentRequestByProject } from "../services/investmentRequestService";
import { getADPByProject } from "../services/adpService";
import { getActionsByProject } from "../services/actionService";
import { getApprovalsByProject } from "../services/approvalService";
import { getRisksByProject } from "../services/riskService";
import { getDocumentsByProject } from "../services/documentService";
import { getAuditLogsByProject } from "../services/auditService";
import { getCommentsByRelatedId } from "../services/commentService";

/**
 * Custom hook to load a 360° view of a project.
 * @param {string} projectId 
 */
export function useProject(projectId) {
  const [project, setProject] = useState(null);
  const [investmentRequest, setInvestmentRequest] = useState(null);
  const [adp, setAdp] = useState(null);
  const [actions, setActions] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [risks, setRisks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjectData = useCallback(async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // Load central project entity
      const projectData = await getProjectById(projectId);
      if (!projectData) {
        throw new Error("El proyecto no existe.");
      }
      setProject(projectData);

      // Load related collections in parallel
      const [
        invReq,
        adpData,
        actionsList,
        approvalsList,
        risksList,
        docsList,
        audits,
        commentsList
      ] = await Promise.all([
        getInvestmentRequestByProject(projectId),
        getADPByProject(projectId),
        getActionsByProject(projectId),
        getApprovalsByProject(projectId),
        getRisksByProject(projectId),
        getDocumentsByProject(projectId),
        getAuditLogsByProject(projectId),
        getCommentsByRelatedId(projectId)
      ]);

      setInvestmentRequest(invReq);
      setAdp(adpData);
      setActions(actionsList);
      setApprovals(approvalsList);
      setRisks(risksList);
      setDocuments(docsList);
      setAuditLogs(audits);
      setComments(commentsList);
    } catch (err) {
      console.error("Failed to load project 360 data:", err);
      setError(err.message || "Error al cargar el expediente del proyecto");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProjectData();
  }, [projectId, fetchProjectData]);

  return {
    project,
    investmentRequest,
    adp,
    actions,
    approvals,
    risks,
    documents,
    auditLogs,
    comments,
    loading,
    error,
    refresh: fetchProjectData
  };
}
export default useProject;
