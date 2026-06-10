import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { projectSchema } from "../utils/validators";
import { createAuditLog } from "./auditService";

/**
 * Creates a new project in Firestore. Enforces leader and area checks.
 * @param {Object} projectData 
 * @param {string} userId - User initiating action
 * @returns {Promise<string>} Created projectId
 */
export async function createProject(projectData, userId) {
  if (!projectData.projectLeaderId) {
    throw new Error("RN-01: Todo proyecto debe tener un Líder de Proyecto.");
  }
  if (!projectData.areaId) {
    throw new Error("RN-02: Todo proyecto debe tener un Área.");
  }

  const projectId = projectData.projectId || doc(collection(db, "projects")).id;
  const projectCode = projectData.projectCode || `CPX-${Math.floor(1000 + Math.random() * 9000)}`;

  const rawProject = {
    ...projectData,
    projectId,
    projectCode,
    status: projectData.status || "Draft",
    currentStage: projectData.currentStage || "ADP-01",
    approvedBudgetUSD: projectData.approvedBudgetUSD || 0,
    spentAmountUSD: projectData.spentAmountUSD || 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    createdBy: userId,
    updatedBy: userId
  };

  // Validate with Zod
  projectSchema.parse(rawProject);

  const docRef = doc(db, "projects", projectId);
  await setDoc(docRef, {
    ...rawProject,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  // Log Audit
  await createAuditLog({
    projectId,
    userId,
    action: "CREATE",
    module: "PROJECT",
    newValue: rawProject
  });

  return projectId;
}

/**
 * Retrieves a project by ID.
 * @param {string} projectId 
 * @returns {Promise<Object|null>}
 */
export async function getProjectById(projectId) {
  if (!projectId) return null;
  const docRef = doc(db, "projects", projectId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
}

/**
 * Retrieves all projects, optionally filtered.
 * @param {Object} [filters] - e.g. { plantId, areaId, status, stage }
 * @returns {Promise<Array>}
 */
export async function getProjects(filters = {}) {
  const colRef = collection(db, "projects");
  let q = query(colRef);
  
  if (filters.plantId) {
    q = query(q, where("plantId", "==", filters.plantId));
  }
  if (filters.areaId) {
    q = query(q, where("areaId", "==", filters.areaId));
  }
  if (filters.status) {
    q = query(q, where("status", "==", filters.status));
  }
  if (filters.stage) {
    q = query(q, where("currentStage", "==", filters.stage));
  }

  const querySnapshot = await getDocs(q);
  const projects = [];
  querySnapshot.forEach((doc) => {
    projects.push({ id: doc.id, ...doc.data() });
  });
  return projects;
}

/**
 * Updates an existing project and logs the audit.
 * @param {string} projectId 
 * @param {Object} projectData 
 * @param {string} userId - User updating
 */
export async function updateProject(projectId, projectData, userId) {
  const docRef = doc(db, "projects", projectId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error("Project not found");
  }
  
  const previousValue = docSnap.data();
  const mergedProject = {
    ...previousValue,
    ...projectData,
    projectId,
    updatedAt: new Date(),
    updatedBy: userId
  };

  // Enforce business rules
  if (!mergedProject.projectLeaderId) {
    throw new Error("RN-01: Todo proyecto debe tener un Líder de Proyecto.");
  }
  if (!mergedProject.areaId) {
    throw new Error("RN-02: Todo proyecto debe tener un Área.");
  }

  // Handle Timestamp conversion if coming from Firestore raw read
  if (mergedProject.createdAt && typeof mergedProject.createdAt.toDate === "function") {
    mergedProject.createdAt = mergedProject.createdAt.toDate();
  }
  if (mergedProject.estimatedStartDate && typeof mergedProject.estimatedStartDate.toDate === "function") {
    mergedProject.estimatedStartDate = mergedProject.estimatedStartDate.toDate();
  }
  if (mergedProject.estimatedEndDate && typeof mergedProject.estimatedEndDate.toDate === "function") {
    mergedProject.estimatedEndDate = mergedProject.estimatedEndDate.toDate();
  }

  // Zod Validate
  projectSchema.parse(mergedProject);

  await updateDoc(docRef, {
    ...projectData,
    updatedAt: serverTimestamp(),
    updatedBy: userId
  });

  // Log Audit
  await createAuditLog({
    projectId,
    userId,
    action: "UPDATE",
    module: "PROJECT",
    previousValue,
    newValue: projectData
  });
}

/**
 * Deletes a project.
 * @param {string} projectId 
 * @param {string} userId 
 */
export async function deleteProject(projectId, userId) {
  const docRef = doc(db, "projects", projectId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error("Project not found");
  }

  const previousValue = docSnap.data();
  await deleteDoc(docRef);

  await createAuditLog({
    projectId,
    userId,
    action: "DELETE",
    module: "PROJECT",
    previousValue
  });
}

/**
 * Changes a project's status and lifecycle stage.
 * @param {string} projectId 
 * @param {string} newStatus 
 * @param {string} newStage 
 * @param {string} userId 
 */
export async function changeProjectStatus(projectId, newStatus, newStage, userId) {
  const docRef = doc(db, "projects", projectId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error("Project not found");
  }

  const previousValue = docSnap.data();
  
  await updateDoc(docRef, {
    status: newStatus,
    currentStage: newStage,
    updatedAt: serverTimestamp(),
    updatedBy: userId
  });

  await createAuditLog({
    projectId,
    userId,
    action: "STATUS_CHANGE",
    module: "PROJECT",
    previousValue: { status: previousValue.status, currentStage: previousValue.currentStage },
    newValue: { status: newStatus, currentStage: newStage }
  });
}
