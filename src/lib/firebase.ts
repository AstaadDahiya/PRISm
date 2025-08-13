// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  "projectId": "prism-hha5k",
  "appId": "1:171483342302:web:82994bb6902577279f294f",
  "storageBucket": "prism-hha5k.firebasestorage.app",
  "apiKey": "AIzaSyD16Xx2ne4ApXIobzdkK-BGM_tHl-ZGRe0",
  "authDomain": "prism-hha5k.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "171483342302"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
