import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { commentSchema } from "../utils/validators";
import { createAuditLog } from "./auditService";

/**
 * Creates a comment in Firestore.
 * @param {Object} commentData 
 * @param {string} userId 
 * @returns {Promise<string>} Created commentId
 */
export async function createComment(commentData, userId) {
  const commentId = commentData.commentId || doc(collection(db, "comments")).id;
  
  const rawComment = {
    ...commentData,
    commentId,
    userId,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Validate
  commentSchema.parse(rawComment);

  const docRef = doc(db, "comments", commentId);
  await setDoc(docRef, {
    ...rawComment,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  // Log audit locally
  await createAuditLog({
    projectId: commentData.projectId,
    userId,
    action: "ADD_COMMENT",
    module: "COMMENT",
    newValue: { commentId, relatedId: commentData.relatedId }
  });

  return commentId;
}

/**
 * Fetches comments for a specific entity (e.g. project, action item).
 * @param {string} relatedId 
 * @returns {Promise<Array>}
 */
export async function getCommentsByRelatedId(relatedId) {
  if (!relatedId) return [];
  const q = query(
    collection(db, "comments"),
    where("relatedId", "==", relatedId),
    orderBy("createdAt", "asc")
  );
  const querySnapshot = await getDocs(q);
  const comments = [];
  querySnapshot.forEach((doc) => {
    comments.push({ id: doc.id, ...doc.data() });
  });
  return comments;
}
