import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: "taskmanager-d0ca5.firebaseapp.com",
  projectId: "taskmanager-d0ca5",
  storageBucket: "taskmanager-d0ca5.firebasestorage.app",
  messagingSenderId: "374764719426",
  appId: "1:374764719426:web:4ed9da3dc5993978240cdb"
};

export const app = initializeApp(firebaseConfig);
