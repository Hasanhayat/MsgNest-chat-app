import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; 
import { getAnalytics } from "firebase/analytics";


// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMu5b42XdRRY_qdIaXlFmZGfsHshZwfqQ",
  authDomain: "msgnest.firebaseapp.com",
  projectId: "msgnest",
  storageBucket: "msgnest.appspot.com",
  messagingSenderId: "364879098363",
  appId: "1:364879098363:web:6722c78ef9b7d530a65b5e",
  measurementId: "G-C0H0P5DVVD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const realtimeDb = getDatabase(app); 
const analytics = getAnalytics(app);


export { db, realtimeDb }; 