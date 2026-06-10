import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { adpSchema } from "../utils/validators";
import { createAuditLog } from "./auditService";

/**
 * Creates an ADP record.
 * @param {Object} adpData 
 * @param {string} userId 
 * @returns {Promise<string>} Created adpId
 */
export async function createADP(adpData, userId) {
  const adpId = adpData.adpId || doc(collection(db, "adps")).id;
  
  const rawAdp = {
    ...adpData,
    adpId,
    version: adpData.version || 1,
    status: adpData.status || "Draft",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Validate
  adpSchema.parse(rawAdp);

  const docRef = doc(db, "adps", adpId);
  await setDoc(docRef, {
    ...rawAdp,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  await createAuditLog({
    projectId: adpData.projectId,
    userId,
    action: "ADP_CREATED",
    module: "ADP",
    newValue: rawAdp
  });

  return adpId;
}

/**
 * Fetches ADP by projectId.
 * @param {string} projectId 
 * @returns {Promise<Object|null>}
 */
export async function getADPByProject(projectId) {
  if (!projectId) return null;
  
  const q = query(
    collection(db, "adps"),
    where("projectId", "==", projectId)
  );
  
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

/**
 * Updates ADP details.
 * @param {string} adpId 
 * @param {Object} adpData 
 * @param {string} userId 
 */
export async function updateADP(adpId, adpData, userId) {
  const docRef = doc(db, "adps", adpId);
  
  const rawUpdate = {
    ...adpData,
    updatedAt: serverTimestamp()
  };

  await updateDoc(docRef, rawUpdate);

  await createAuditLog({
    projectId: adpData.projectId,
    userId,
    action: "ADP_UPDATED",
    module: "ADP",
    newValue: rawUpdate
  });
}

/**
 * Approves an ADP record.
 * @param {string} adpId 
 * @param {string} projectId 
 * @param {string} userId 
 */
export async function approveADP(adpId, projectId, userId) {
  const docRef = doc(db, "adps", adpId);
  
  await updateDoc(docRef, {
    status: "Approved",
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  await createAuditLog({
    projectId,
    userId,
    action: "APPROVE",
    module: "ADP",
    newValue: { status: "Approved" }
  });
}
