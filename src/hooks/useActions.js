import { useState, useEffect, useCallback } from "react";
import { 
  getActionsByProject, 
  getActionsByUser, 
  createActionItem, 
  updateActionItem, 
  completeActionItem 
} from "../services/actionService";

/**
 * Hook for managing action items.
 * @param {Object} config - e.g. { projectId, userId }
 */
export function useActions(config = {}) {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data = [];
      if (config.projectId) {
        data = await getActionsByProject(config.projectId);
      } else if (config.userId) {
        data = await getActionsByUser(config.userId);
      }
      setActions(data);
    } catch (err) {
      console.error("Failed to fetch actions:", err);
      setError(err.message || "Error al cargar las tareas");
    } finally {
      setLoading(false);
    }
  }, [config.projectId, config.userId]);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  const addAction = async (actionData, initiatorId) => {
    setError(null);
    try {
      await createActionItem(actionData, initiatorId);
      await fetchActions();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const editAction = async (actionId, actionData, initiatorId) => {
    setError(null);
    try {
      await updateActionItem(actionId, actionData, initiatorId);
      await fetchActions();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const completeAction = async (actionId, evidenceId, initiatorId) => {
    setError(null);
    try {
      await completeActionItem(actionId, evidenceId, initiatorId);
      await fetchActions();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    actions,
    loading,
    error,
    addAction,
    editAction,
    completeAction,
    refresh: fetchActions
  };
}
export default useActions;
