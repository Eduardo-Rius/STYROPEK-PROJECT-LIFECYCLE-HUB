import { 
  collection, 
  doc, 
  getDoc,
  setDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { riskSchema } from "../utils/validators";
import { createAuditLog } from "./auditService";

/**
 * Creates a new risk entry.
 * @param {Object} riskData 
 * @param {string} userId 
 * @returns {Promise<string>} Created riskId
 */
export async function createRisk(riskData, userId) {
  const riskId = riskData.riskId || doc(collection(db, "risks")).id;
  
  // Calculate risk level as a function of probability * impact if not provided
  const prob = riskData.probability || 1;
  const imp = riskData.impact || 1;
  const score = prob * imp;
  let level = "Low";
  if (score >= 12) level = "High";
  else if (score >= 6) level = "Medium";

  const rawRisk = {
    ...riskData,
    riskId,
    probability: prob,
    impact: imp,
    riskLevel: riskData.riskLevel || level,
    status: riskData.status || "Active",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Validate
  riskSchema.parse(rawRisk);

  const docRef = doc(db, "risks", riskId);
  await setDoc(docRef, {
    ...rawRisk,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  await createAuditLog({
    projectId: riskData.projectId,
    userId,
    action: "CREATE_RISK",
    module: "RISK",
    newValue: rawRisk
  });

  return riskId;
}

/**
 * Fetch risks for a project.
 * @param {string} projectId 
 * @returns {Promise<Array>}
 */
export async function getRisksByProject(projectId) {
  if (!projectId) return [];
  const q = query(
    collection(db, "risks"),
    where("projectId", "==", projectId)
  );
  const querySnapshot = await getDocs(q);
  const risks = [];
  querySnapshot.forEach((doc) => {
    risks.push({ id: doc.id, ...doc.data() });
  });
  return risks;
}

/**
 * Updates a risk entry.
 * @param {string} riskId 
 * @param {Object} riskData 
 * @param {string} userId 
 */
export async function updateRisk(riskId, riskData, userId) {
  const docRef = doc(db, "risks", riskId);
  const rawUpdate = {
    ...riskData,
    updatedAt: serverTimestamp()
  };

  await updateDoc(docRef, rawUpdate);

  await createAuditLog({
    projectId: riskData.projectId,
    userId,
    action: "UPDATE_RISK",
    module: "RISK",
    newValue: rawUpdate
  });
}

/**
 * Deletes a risk entry.
 * @param {string} riskId 
 * @param {string} projectId 
 * @param {string} userId 
 */
export async function deleteRisk(riskId, projectId, userId) {
  const docRef = doc(db, "risks", riskId);
  await deleteDoc(docRef);

  await createAuditLog({
    projectId,
    userId,
    action: "DELETE_RISK",
    module: "RISK",
    newValue: { riskId }
  });
}

/**
 * Closes a risk entry by setting its status to 'Closed'.
 * @param {string} riskId
 * @param {string} userId - User performing the closure.
 */
export async function closeRisk(riskId, userId) {
  const docRef = doc(db, "risks", riskId);
  const rawUpdate = {
    status: "Closed",
    updatedAt: serverTimestamp()
  };
  await updateDoc(docRef, rawUpdate);
  // Fetch projectId for audit log
  const docSnap = await getDoc(docRef);
  const projectId = docSnap.exists() ? docSnap.data().projectId : null;
  await createAuditLog({
    projectId,
    userId,
    action: "RISK_CLOSED",
    module: "RISK",
    newValue: rawUpdate
  });
}
