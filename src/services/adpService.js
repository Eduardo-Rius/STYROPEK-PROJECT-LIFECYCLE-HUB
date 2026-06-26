import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
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
  
  const getActionStyle = (action) => {
    switch (action) {
      case "APPROVAL_REQUESTED": return "bg-indigo-500 text-white";
      case "APPROVAL_APPROVED": return "bg-success text-white";
      case "APPROVAL_REJECTED": return "bg-danger text-white";
      case "RISK_CLOSED": return "bg-amber-500 text-white";
      case "DOCUMENT_UPLOADED": return "bg-purple-500 text-white";
      case "ACTION_CREATED": return "bg-emerald-500 text-white";
      case "ACTION_COMPLETED": return "bg-brand-500 text-white";
      default: return "bg-industrial-500 text-white";
    }
  };
  
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
    action: "DOCUMENT_UPLOADED",
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
    where("projectId", "==", projectId),
    orderBy("version", "desc"),
    limit(1)
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
    action: "ACTION_COMPLETED",
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
  const getActionLabel = (action) => {
    switch (action) {
      case "APPROVAL_REQUESTED": return "Solicitud de Aprobación";
      case "APPROVAL_APPROVED": return "Aprobado";
      case "APPROVAL_REJECTED": return "Rechazado";
      case "RISK_CLOSED": return "Riesgo Cerrado";
      case "DOCUMENT_UPLOADED": return "Documento Subido";
      case "ACTION_CREATED": return "Acción Creada";
      case "ACTION_COMPLETED": return "Acción Completada";
      default: return action;
    }
  };

  const docRef = doc(db, "adps", adpId);
  
  await updateDoc(docRef, {
    status: "Approved",
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  await createAuditLog({
    projectId,
    userId,
    action: "APPROVAL_APPROVED",
    module: "ADP",
    newValue: { status: "Approved" }
  });
}
