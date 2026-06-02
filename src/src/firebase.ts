import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAojwS7XRsl6gMFxVGNWw9tbCvCV1hg4Q8",
  authDomain: "quiniela-ae495.firebaseapp.com",
  databaseURL: "https://quiniela-ae495-default-rtdb.firebaseio.com",
  projectId: "quiniela-ae495",
  storageBucket: "quiniela-ae495.firebasestorage.app",
  messagingSenderId: "966536069441",
  appId: "1:966536069441:web:dcd04e374a587b86dee1c0",
  measurementId: "G-Q525BEKYFQ"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
