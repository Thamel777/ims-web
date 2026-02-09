import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbBM2f5np9bM9_qOoJ85m36lSTFJVk7uo",
  authDomain: "ims-cross-app.firebaseapp.com",
  databaseURL: "https://ims-cross-app-default-rtdb.firebaseio.com",
  projectId: "ims-cross-app",
  storageBucket: "ims-cross-app.firebasestorage.app",
  messagingSenderId: "769332407701",
  appId: "1:769332407701:web:placeholder", // This may fail if appId is strictly required for certain features
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {app, auth, db};
