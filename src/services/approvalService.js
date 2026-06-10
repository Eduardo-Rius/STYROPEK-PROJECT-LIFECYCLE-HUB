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
import { approvalSchema } from "../utils/validators";
import { createAuditLog } from "./auditService";

/**
 * Initiates an approval request.
 * Enforces RN-07: Every approval must generate history.
 * @param {Object} approvalData 
 * @param {string} userId - Initiating project leader / user
 * @returns {Promise<string>} Created approvalId
 */
export async function requestApproval(approvalData, userId) {
  const approvalId = approvalData.approvalId || doc(collection(db, "approvals")).id;
  
  const rawApproval = {
    ...approvalData,
    approvalId,
    status: "Pending",
    requestedAt: new Date(),
    approvedAt: null,
    rejectedAt: null,
    delegatedTo: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Validate
  approvalSchema.parse(rawApproval);

  const docRef = doc(db, "approvals", approvalId);
  await setDoc(docRef, {
    ...rawApproval,
    requestedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  await createAuditLog({
    projectId: approvalData.projectId,
    userId,
    action: "REQUEST_APPROVAL",
    module: "APPROVAL",
    newValue: rawApproval
  });

  return approvalId;
}

/**
 * Approves a request.
 * @param {string} approvalId 
 * @param {string} comments 
 * @param {string} userId - Approver ID
 */
export async function approve(approvalId, comments = "", userId) {
  const docRef = doc(db, "approvals", approvalId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("Approval request not found");
  }

  const data = docSnap.data();

  const updateFields = {
    status: "Approved",
    comments,
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await updateDoc(docRef, updateFields);

  await createAuditLog({
    projectId: data.projectId,
    userId,
    action: "APPROVE",
    module: "APPROVAL",
    previousValue: { status: data.status, comments: data.comments },
    newValue: { status: "Approved", comments }
  });
}

/**
 * Rejects an approval request.
 * @param {string} approvalId 
 * @param {string} comments 
 * @param {string} userId - Approver ID
 */
export async function reject(approvalId, comments = "", userId) {
  const docRef = doc(db, "approvals", approvalId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("Approval request not found");
  }

  const data = docSnap.data();

  const updateFields = {
    status: "Rejected",
    comments,
    rejectedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await updateDoc(docRef, updateFields);

  await createAuditLog({
    projectId: data.projectId,
    userId,
    action: "REJECT",
    module: "APPROVAL",
    previousValue: { status: data.status, comments: data.comments },
    newValue: { status: "Rejected", comments }
  });
}

/**
 * Fetch approval requests for a specific project.
 * @param {string} projectId 
 * @returns {Promise<Array>}
 */
export async function getApprovalsByProject(projectId) {
  if (!projectId) return [];
  const q = query(
    collection(db, "approvals"),
    where("projectId", "==", projectId)
  );
  const querySnapshot = await getDocs(q);
  const approvals = [];
  querySnapshot.forEach((doc) => {
    approvals.push({ id: doc.id, ...doc.data() });
  });
  return approvals;
}
