// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDAMySm--bhBwwmh64-9_ZNQMiq-KHgb7M",
  authDomain: "luxestay-4f0a3.firebaseapp.com",
  projectId: "luxestay-4f0a3",
  storageBucket: "luxestay-4f0a3.appspot.com",
  messagingSenderId: "1056598268598",
  appId: "1:1056598268598:web:b2932c2704ac0289e8e417",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const storage = getStorage(app);

export { db, storage };
