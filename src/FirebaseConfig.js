import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAM12OZOQaJRQpinaDaVD_A7B-dFZRluMs",
  authDomain: "itms-project-43973.firebaseapp.com",
  projectId: "itms-project-43973",
  storageBucket: "itms-project-43973.firebasestorage.app",
  messagingSenderId: "495788562409",
  appId: "1:495788562409:web:690bf873a27f061419dd78",
  measurementId: "G-9MTENGZN2G"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);