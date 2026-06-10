import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { auditLogSchema } from "../utils/validators";

/**
 * Creates an audit log entry in Firestore.
 * @param {Object} logData 
 * @param {string} logData.projectId
 * @param {string} logData.userId
 * @param {string} logData.action - e.g., "CREATE", "UPDATE", "STATUS_CHANGE"
 * @param {string} logData.module - e.g., "PROJECT", "ADP", "APPROVAL"
 * @param {Object} [logData.previousValue]
 * @param {Object} [logData.newValue]
 */
export async function createAuditLog(logData) {
  try {
    const auditColRef = collection(db, "auditLogs");
    
    const rawLog = {
      auditId: doc(collection(db, "auditLogs")).id, // pre-generate ID
      projectId: logData.projectId,
      userId: logData.userId,
      action: logData.action,
      module: logData.module,
      previousValue: logData.previousValue || null,
      newValue: logData.newValue || null,
      timestamp: new Date(),
      ipAddress: "127.0.0.1" // Local client placeholder
    };
    
    // Validate with Zod
    auditLogSchema.parse(rawLog);
    
    // Write to Firestore (override timestamp to serverTimestamp for consistency)
    const auditDocRef = await addDoc(auditColRef, {
      ...rawLog,
      timestamp: serverTimestamp()
    });
    
    return auditDocRef.id;
  } catch (error) {
    console.error("Failed to create audit log:", error);
    // Silent fail in production or throw to alert
    return null;
  }
}

// Helper import to resolve the doc function since we used doc() in pre-generating auditId
import { doc } from "firebase/firestore";

/**
 * Retrieves audit logs associated with a project, ordered by timestamp descending.
 * @param {string} projectId 
 * @returns {Promise<Array>}
 */
export async function getAuditLogsByProject(projectId) {
  if (!projectId) return [];
  
  const q = query(
    collection(db, "auditLogs"),
    where("projectId", "==", projectId),
    orderBy("timestamp", "desc")
  );
  
  const querySnapshot = await getDocs(q);
  const logs = [];
  querySnapshot.forEach((doc) => {
    logs.push({ id: doc.id, ...doc.data() });
  });
  return logs;
}
