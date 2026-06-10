import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { scheduleSchema } from "../utils/validators";
import { createAuditLog } from "./auditService";

/**
 * Creates a schedule task.
 * @param {Object} taskData 
 * @param {string} userId 
 * @returns {Promise<string>} Created scheduleId
 */
export async function createScheduleTask(taskData, userId) {
  const scheduleId = taskData.scheduleId || doc(collection(db, "schedules")).id;
  
  const rawTask = {
    ...taskData,
    scheduleId,
    plannedProgress: taskData.plannedProgress || 0,
    actualProgress: taskData.actualProgress || 0,
    dependencyIds: taskData.dependencyIds || [],
    isCriticalPath: taskData.isCriticalPath !== undefined ? taskData.isCriticalPath : false,
    status: taskData.status || "Planned",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  if (typeof rawTask.startDate === "string") rawTask.startDate = new Date(rawTask.startDate);
  if (typeof rawTask.endDate === "string") rawTask.endDate = new Date(rawTask.endDate);

  // Validate
  scheduleSchema.parse(rawTask);

  const docRef = doc(db, "schedules", scheduleId);
  await setDoc(docRef, {
    ...rawTask,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  await createAuditLog({
    projectId: taskData.projectId,
    userId,
    action: "CREATE_SCHEDULE_TASK",
    module: "SCHEDULE",
    newValue: rawTask
  });

  return scheduleId;
}

/**
 * Fetch schedule tasks for a project.
 * @param {string} projectId 
 * @returns {Promise<Array>}
 */
export async function getScheduleByProject(projectId) {
  if (!projectId) return [];
  const q = query(
    collection(db, "schedules"),
    where("projectId", "==", projectId)
  );
  const querySnapshot = await getDocs(q);
  const tasks = [];
  querySnapshot.forEach((doc) => {
    tasks.push({ id: doc.id, ...doc.data() });
  });
  return tasks;
}

/**
 * Updates a schedule task.
 * @param {string} scheduleId 
 * @param {Object} taskData 
 * @param {string} userId 
 */
export async function updateScheduleTask(scheduleId, taskData, userId) {
  const docRef = doc(db, "schedules", scheduleId);
  
  const rawUpdate = {
    ...taskData,
    updatedAt: serverTimestamp()
  };

  if (taskData.startDate && typeof taskData.startDate === "string") rawUpdate.startDate = new Date(taskData.startDate);
  if (taskData.endDate && typeof taskData.endDate === "string") rawUpdate.endDate = new Date(taskData.endDate);

  await updateDoc(docRef, rawUpdate);

  await createAuditLog({
    projectId: taskData.projectId,
    userId,
    action: "UPDATE_SCHEDULE_TASK",
    module: "SCHEDULE",
    newValue: rawUpdate
  });
}

/**
 * Deletes a schedule task.
 * @param {string} scheduleId 
 * @param {string} projectId 
 * @param {string} userId 
 */
export async function deleteScheduleTask(scheduleId, projectId, userId) {
  const docRef = doc(db, "schedules", scheduleId);
  await deleteDoc(docRef);

  await createAuditLog({
    projectId,
    userId,
    action: "DELETE_SCHEDULE_TASK",
    module: "SCHEDULE",
    newValue: { scheduleId }
  });
}
