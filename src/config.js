// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyCS_gngBbBLiW5u1ZLVBBRk8mPRbQ1DO8Q",
   authDomain: "task-3b29f.firebaseapp.com",
   projectId: "task-3b29f",
   storageBucket: "task-3b29f.appspot.com",
   messagingSenderId: "438305841385",
   appId: "1:438305841385:web:2bb301f92d643f0b519078",
   measurementId: "G-NE4FZQMZRT"
};


// Initialize Firebase (

firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const authentication = getAuth(app);
const db = getFirestore(app);
export { firebase, authentication , db};

 
 