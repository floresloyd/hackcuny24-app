// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApHnNWITelagplXlUaYRP8na9--2nT8HI",
  authDomain: "nystrong-21624.firebaseapp.com",
  projectId: "nystrong-21624",
  storageBucket: "nystrong-21624.appspot.com",
  messagingSenderId: "258005372258",
  appId: "1:258005372258:web:2336dfed540eaaebb0303b",
  measurementId: "G-QWHSZV62L9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const userDatabase = getAuth(app)

export default userDatabase;
console.log("Test")