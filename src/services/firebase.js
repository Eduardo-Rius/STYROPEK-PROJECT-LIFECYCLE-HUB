import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBentV72pYIVIGhnmD4scCtZMiyC_28mqI",
  authDomain: "styropek-project-lifecycle-hub.firebaseapp.com",
  projectId: "styropek-project-lifecycle-hub",
  storageBucket: "styropek-project-lifecycle-hub.firebasestorage.app",
  messagingSenderId: "601021001934",
  appId: "1:601021001934:web:8e844bb610827c6fe0609f",
  measurementId: "G-MQHFGNQHN2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
