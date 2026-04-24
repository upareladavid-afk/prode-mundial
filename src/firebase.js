import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_q5-l3L5aiwLUNzHMpZlIHB6JNYsxU4k",
  authDomain: "prode-mundial-2026-7db08.firebaseapp.com",
  projectId: "prode-mundial-2026-7db08",
  storageBucket: "prode-mundial-2026-7db08.firebasestorage.app",
  messagingSenderId: "406600706316",
  appId: "1:406600706316:web:0e60ce4f9c27ebee534129"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);