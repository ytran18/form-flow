// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database"
import "firebase/compat/auth"
import "firebase/auth"
import "firebase/storage"
import "firebase/analytics"
import "firebase/performance"
import { getAuth} from "firebase/auth"
import { getStorage } from "firebase/storage"
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBIGhYYZEfzGYIpYFFnfqVyZdU1iJ-6faw",
    authDomain: "an-toan-lao-dong.firebaseapp.com",
    projectId: "an-toan-lao-dong",
    storageBucket: "an-toan-lao-dong.appspot.com",
    messagingSenderId: "118962765669",
    appId: "1:118962765669:web:857ddb222da53b6e176b8c"
};
  

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getDatabase(app)
const storage = getStorage(app)
const fireStore = getFirestore(app)

export {app, auth, db, storage, fireStore}