import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

/**
 * Log in a user with email and password.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<UserCredential>}
 */
export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Register a new user in Firebase Auth.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<UserCredential>}
 */
export async function register(email, password) {
  return createUserWithEmailAndPassword(auth, email, password);
}


/**
 * Log out the current user.
 * @returns {Promise<void>}
 */
export async function logout() {
  return signOut(auth);
}

/**
 * Fetch a user profile document from Firestore.
 * @param {string} userId 
 * @returns {Promise<Object|null>}
 */
export async function getCurrentUserDoc(userId) {
  if (!userId) return null;
  const userDocRef = doc(db, "users", userId);
  const userSnap = await getDoc(userDocRef);
  if (userSnap.exists()) {
    return userSnap.data();
  }
  return null;
}

/**
 * Create or update a user profile document in Firestore.
 * @param {string} userId 
 * @param {Object} userData 
 * @returns {Promise<void>}
 */
export async function createUserDoc(userId, userData) {
  const userDocRef = doc(db, "users", userId);
  return setDoc(userDocRef, {
    userId,
    ...userData,
    isActive: userData.isActive !== undefined ? userData.isActive : true,
    createdAt: userData.createdAt || new Date(),
    updatedAt: new Date()
  }, { merge: true });
}

/**
 * Subscribes to auth changes and loads matching profile data.
 * @param {Function} callback - Triggered with (user, profileDoc)
 * @returns {Function} Unsubscribe function
 */
export function subscribeToAuth(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const profile = await getCurrentUserDoc(user.uid);
        callback(user, profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        callback(user, null);
      }
    } else {
      callback(null, null);
    }
  });
}
