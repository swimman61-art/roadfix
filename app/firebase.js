import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "PASTE_YOUR_API_KEY",
  authDomain: "roadfix-ef1a4.firebaseapp.com",
  projectId: "roadfix-ef1a4",
  storageBucket: "roadfix-ef1a4.appspot.com",
  messagingSenderId: "232775464414",
  appId: "1:232775464414:web:39e3fa2ee45cd57c87594f"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);