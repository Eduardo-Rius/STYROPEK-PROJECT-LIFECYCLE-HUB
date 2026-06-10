import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { actionItemSchema } from "../utils/validators";
import { createAuditLog } from "./auditService";

/**
 * Creates a new action item. Enforces responsible assignment rule.
 * @param {Object} actionData 
 * @param {string} userId - Initiator
 * @returns {Promise<string>} Created actionId
 */
export async function createActionItem(actionData, userId) {
  if (!actionData.responsibleUserId) {
    throw new Error("RN-06: Toda acción debe tener responsable.");
  }

  const actionId = actionData.actionId || doc(collection(db, "actionItems")).id;
  
  const rawAction = {
    ...actionData,
    actionId,
    status: actionData.status || "Open",
    priority: actionData.priority || "Medium",
    evidenceRequired: actionData.evidenceRequired !== undefined ? actionData.evidenceRequired : false,
    evidenceId: actionData.evidenceId || null,
    createdBy: userId,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Convert dueDate if it's a date or ISO string
  if (typeof rawAction.dueDate === "string") {
    rawAction.dueDate = new Date(rawAction.dueDate);
  }

  // Validate
  actionItemSchema.parse(rawAction);

  const docRef = doc(db, "actionItems", actionId);
  await setDoc(docRef, {
    ...rawAction,
    dueDate: rawAction.dueDate, // Keep date
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  await createAuditLog({
    projectId: actionData.projectId,
    userId,
    action: "CREATE",
    module: "ACTION_ITEM",
    newValue: rawAction
  });

  return actionId;
}

/**
 * Retrieves all action items for a specific project.
 * @param {string} projectId 
 * @returns {Promise<Array>}
 */
export async function getActionsByProject(projectId) {
  if (!projectId) return [];
  const q = query(
    collection(db, "actionItems"),
    where("projectId", "==", projectId)
  );
  const querySnapshot = await getDocs(q);
  const actions = [];
  querySnapshot.forEach((doc) => {
    actions.push({ id: doc.id, ...doc.data() });
  });
  return actions;
}

/**
 * Retrieves action items assigned to a user.
 * @param {string} assignedUserId 
 * @returns {Promise<Array>}
 */
export async function getActionsByUser(assignedUserId) {
  if (!assignedUserId) return [];
  const q = query(
    collection(db, "actionItems"),
    where("responsibleUserId", "==", assignedUserId)
  );
  const querySnapshot = await getDocs(q);
  const actions = [];
  querySnapshot.forEach((doc) => {
    actions.push({ id: doc.id, ...doc.data() });
  });
  return actions;
}

/**
 * Updates action item details.
 * @param {string} actionId 
 * @param {Object} actionData 
 * @param {string} userId 
 */
export async function updateActionItem(actionId, actionData, userId) {
  if (actionData.responsibleUserId === "") {
    throw new Error("RN-06: Toda acción debe tener responsable.");
  }
  
  const docRef = doc(db, "actionItems", actionId);
  const rawUpdate = {
    ...actionData,
    updatedAt: serverTimestamp()
  };

  if (actionData.dueDate && typeof actionData.dueDate === "string") {
    rawUpdate.dueDate = new Date(actionData.dueDate);
  }

  await updateDoc(docRef, rawUpdate);

  await createAuditLog({
    projectId: actionData.projectId,
    userId,
    action: "UPDATE",
    module: "ACTION_ITEM",
    newValue: rawUpdate
  });
}

/**
 * Marks an action item as completed, linking evidence if required.
 * @param {string} actionId 
 * @param {string} [evidenceId] 
 * @param {string} userId 
 */
export async function completeActionItem(actionId, evidenceId, userId) {
  const docRef = doc(db, "actionItems", actionId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("Action item not found");
  }

  const data = docSnap.data();
  
  let newStatus = "Completed";
  // If evidence is required and none is provided, put in "Waiting Evidence"
  if (data.evidenceRequired && !evidenceId && !data.evidenceId) {
    newStatus = "Waiting Evidence";
  }

  const updateFields = {
    status: newStatus,
    evidenceId: evidenceId || data.evidenceId || null,
    completionDate: newStatus === "Completed" ? serverTimestamp() : null,
    updatedAt: serverTimestamp()
  };

  await updateDoc(docRef, updateFields);

  await createAuditLog({
    projectId: data.projectId,
    userId,
    action: "COMPLETE",
    module: "ACTION_ITEM",
    newValue: updateFields
  });
}
