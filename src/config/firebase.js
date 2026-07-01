import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// The user has not provided a config yet. We use dummy values to satisfy initializeApp.
// In a real scenario, these will come from .env
import { getStorage } from "firebase/storage";

// TODO: Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8u2N_Lns28iXkbDh0FiJ9Lu7wmzawED0",
  authDomain: "medical-store-b80f8.firebaseapp.com",
  databaseURL: "https://medical-store-b80f8-default-rtdb.firebaseio.com",
  projectId: "medical-store-b80f8",
  storageBucket: "medical-store-b80f8.firebasestorage.app",
  messagingSenderId: "1008962535992",
  appId: "1:1008962535992:web:da1744e57bd5c8c6419ccd",
  measurementId: "G-85ZZLQ970M"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
