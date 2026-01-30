
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvTK-7fsPqGmgpaidWAp0i8WPR2uHpNs8",
  authDomain: "expense-8f27e.firebaseapp.com",
  projectId: "expense-8f27e",
  storageBucket: "expense-8f27e.appspot.com",
  messagingSenderId: "951035887697",
  appId: "1:951035887697:web:229467b8ba4434452c3870",
  measurementId: "G-84QKYDRQH3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
