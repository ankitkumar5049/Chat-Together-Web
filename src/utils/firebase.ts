// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlpXmV6n2uW3ceZTqCqxMhyTNHZ2jNek4",
  authDomain: "chattogether-bf81c.firebaseapp.com",
  databaseURL: "https://chattogether-bf81c-default-rtdb.firebaseio.com",
  projectId: "chattogether-bf81c",
  storageBucket: "chattogether-bf81c.firebasestorage.app",
  messagingSenderId: "269701132397",
  appId: "1:269701132397:web:311b0e1e50ad4f16c90f64",
  measurementId: "G-0F0HXXQVF8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
// const database = getDatabase(app);