import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { storage, db } from "./firebase";
import { documentSchema } from "../utils/validators";
import { createAuditLog } from "./auditService";

/**
 * Uploads a document to Firebase Storage and saves metadata in Firestore.
 * Enforces RN-05: Must relate to a project.
 * @param {string} projectId 
 * @param {File} file - Browser File object
 * @param {Object} metadata - e.g. { documentType, relatedModule, requiresApproval }
 * @param {string} userId - Uploader ID
 * @returns {Promise<Object>} Created document metadata document
 */
export async function uploadDocument(projectId, file, metadata = {}, userId) {
  if (!projectId) {
    throw new Error("RN-05: Todo documento debe estar relacionado a un proyecto.");
  }

  const documentId = doc(collection(db, "documents")).id;
  const fileExtension = file.name.split(".").pop().toLowerCase();
  
  // Storage structure: /projects/{projectId}/documents/{documentId}_{fileName}
  const storagePath = `projects/${projectId}/documents/${documentId}_${file.name}`;
  const storageRef = ref(storage, storagePath);

  // Upload to Firebase Storage
  await uploadBytes(storageRef, file);
  const fileUrl = await getDownloadURL(storageRef);
  const downloadUrl = fileUrl; // alias for compatibility

  const rawDocument = {
    documentId,
    projectId,
    documentType: metadata.documentType || "Otro",
    fileName: file.name,
    fileUrl,
    downloadUrl,
    storagePath,
    fileExtension,
    fileSize: file.size,
    version: metadata.version || 1,
    uploadedBy: userId,
    uploadedByName: metadata.uploadedByName || "Usuario no identificado",
    uploadedByRole: metadata.uploadedByRole || "Sin rol asignado",
    uploadedByEmail: metadata.uploadedByEmail || "",
    uploadedByUid: metadata.uploadedByUid || userId,
    uploadedAt: new Date(),
    status: metadata.status || "Pending Review",
    tags: metadata.tags || [],
    relatedModule: metadata.relatedModule || null,
    requiresApproval: metadata.requiresApproval !== undefined ? metadata.requiresApproval : false,
    approvedAt: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Validate
  documentSchema.parse(rawDocument);

  const docRef = doc(db, "documents", documentId);
  await setDoc(docRef, {
    ...rawDocument,
    uploadedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  await createAuditLog({
    projectId,
    userId,
    action: "DOCUMENT_UPLOADED",
    module: "DOCUMENT",
    newValue: rawDocument
  });

  return { id: documentId, ...rawDocument };
}

/**
 * Mock/direct registration of metadata when file is already uploaded or using path references
 */
export async function registerDocumentMetadata(documentData, userId) {
  if (!documentData.projectId) {
    throw new Error("RN-05: Todo documento debe estar relacionado a un proyecto.");
  }
  const documentId = documentData.documentId || doc(collection(db, "documents")).id;
  
  const rawDocument = {
    ...documentData,
    documentId,
    version: documentData.version || 1,
    uploadedBy: userId,
    uploadedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  documentSchema.parse(rawDocument);

  const docRef = doc(db, "documents", documentId);
  await setDoc(docRef, {
    ...rawDocument,
    uploadedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  await createAuditLog({
    projectId: documentData.projectId,
    userId,
    action: "UPLOAD_DOCUMENT",
    module: "DOCUMENT",
    newValue: rawDocument
  });

  return { id: documentId, ...rawDocument };
}

/**
 * Gets documents related to a project.
 * @param {string} projectId 
 * @returns {Promise<Array>}
 */
export async function getDocumentsByProject(projectId) {
  if (!projectId) return [];
  const q = query(
    collection(db, "documents"),
    where("projectId", "==", projectId)
  );
  const querySnapshot = await getDocs(q);
  const documents = [];
  querySnapshot.forEach((doc) => {
    documents.push({ documentId: doc.id, id: doc.id, ...doc.data() });
  });
  return documents;
}

/**
 * Updates document metadata.
 * @param {string} documentId 
 * @param {Object} metadata 
 * @param {string} userId 
 */
export async function updateDocumentMetadata(documentId, metadata, userId) {
  const docRef = doc(db, "documents", documentId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("Document not found");
  }
  const data = docSnap.data();

  await updateDoc(docRef, {
    ...metadata,
    updatedAt: serverTimestamp()
  });

  await createAuditLog({
    projectId: data.projectId,
    userId,
    action: "UPDATE_DOCUMENT_METADATA",
    module: "DOCUMENT",
    newValue: metadata
  });
}

/**
 * Deletes a document from Storage and metadata from Firestore.
 * @param {string} documentId 
 * @param {string} userId 
 */
export async function deleteDocument(documentId, userId) {
  const docRef = doc(db, "documents", documentId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) {
    throw new Error("Document not found");
  }
  const data = docSnap.data();

  // Delete from storage
  try {
    const storageRef = ref(storage, data.storagePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.warn("Storage deletion failed or file not found in storage:", error);
  }

  // Delete metadata
  await deleteDoc(docRef);

  await createAuditLog({
    projectId: data.projectId,
    userId,
    action: "DELETE_DOCUMENT",
    module: "DOCUMENT",
    previousValue: data
  });
}
