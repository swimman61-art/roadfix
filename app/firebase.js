import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA-D72BLG2CoBsIlfZybuvJucyo3LKcTMg",
  authDomain: "roadfix-ef1a4.firebaseapp.com",
  projectId: "roadfix-ef1a4",
  storageBucket: "roadfix-ef1a4.appspot.com",
  messagingSenderId: "232775464414",
  appId: "1:232775464414:web:39e3fa2ee45cd57c87594f"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);