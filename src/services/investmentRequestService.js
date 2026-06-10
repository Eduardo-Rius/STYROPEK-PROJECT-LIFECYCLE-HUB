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
import { investmentRequestSchema } from "../utils/validators";
import { createAuditLog } from "./auditService";

/**
 * Creates a new Investment Request.
 * @param {Object} requestData 
 * @param {string} userId 
 * @returns {Promise<string>} Created investmentRequestId
 */
export async function createInvestmentRequest(requestData, userId) {
  const investmentRequestId = requestData.investmentRequestId || doc(collection(db, "investmentRequests")).id;
  
  const rawRequest = {
    ...requestData,
    investmentRequestId,
    status: requestData.status || "Draft",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Zod Validate
  investmentRequestSchema.parse(rawRequest);

  const docRef = doc(db, "investmentRequests", investmentRequestId);
  await setDoc(docRef, {
    ...rawRequest,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  await createAuditLog({
    projectId: requestData.projectId,
    userId,
    action: "CREATE",
    module: "INVESTMENT_REQUEST",
    newValue: rawRequest
  });

  return investmentRequestId;
}

/**
 * Fetch investment request for a given project.
 * @param {string} projectId 
 * @returns {Promise<Object|null>}
 */
export async function getInvestmentRequestByProject(projectId) {
  if (!projectId) return null;
  
  const q = query(
    collection(db, "investmentRequests"),
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
 * Updates an Investment Request.
 * @param {string} requestId 
 * @param {Object} requestData 
 * @param {string} userId 
 */
export async function updateInvestmentRequest(requestId, requestData, userId) {
  const docRef = doc(db, "investmentRequests", requestId);
  
  const rawUpdate = {
    ...requestData,
    updatedAt: serverTimestamp()
  };

  await updateDoc(docRef, rawUpdate);

  await createAuditLog({
    projectId: requestData.projectId,
    userId,
    action: "UPDATE",
    module: "INVESTMENT_REQUEST",
    newValue: rawUpdate
  });
}
