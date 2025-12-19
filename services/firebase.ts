
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBEBk22JaseTkyeGQAP1ctuRiKeyj8ico4",
  authDomain: "kepy-bb8b8.firebaseapp.com",
  projectId: "kepy-bb8b8",
  storageBucket: "kepy-bb8b8.firebasestorage.app",
  messagingSenderId: "247311747048",
  appId: "1:247311747048:web:5acb774cefc0087affc65d",
  measurementId: "G-KYS3YG04ZG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
