import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBog9IXvOZUucLzEK2pIThOLbzbY1JjTwA",
  authDomain: "ims-cross-app.firebaseapp.com",
  databaseURL: "https://ims-cross-app-default-rtdb.firebaseio.com",
  projectId: "ims-cross-app",
  storageBucket: "ims-cross-app.firebasestorage.app",
  messagingSenderId: "769332407701",
  appId: "1:769332407701:web:f61e3f00d4098bc2dc9a9c",
  measurementId: "G-GQET7LG642"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);

export { app, auth, db, rtdb };
