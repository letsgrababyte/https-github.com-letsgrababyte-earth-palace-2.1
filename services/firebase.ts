import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: REPLACE WITH YOUR FIREBASE CONFIGURATION
// You can get this from the Firebase Console -> Project Settings -> General -> Your Apps
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Simple check to see if the user has configured the app
export const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";

// Initialize Firebase
// We wrap in a try/catch to prevent app crash if config is missing during development
let app;
let auth;
let db;

try {
  if (isFirebaseConfigured) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  }
} catch (error) {
  console.error("Firebase initialization error. Make sure to update services/firebase.ts with your config.", error);
}

export { auth, db };