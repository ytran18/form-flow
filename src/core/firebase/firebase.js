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
    apiKey: process.env.REACT_APP_DB_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_DB_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_DB_PROJECT_ID,
    storageBucket: process.env.REACT_APP_DB_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_DB_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_DB_APP_ID
};


// Initialize Firebase
const app = initializeApp(firebaseConfig, 'app1')
const auth = getAuth(app)
const db = getDatabase(app)
const storage = getStorage(app)
const fireStore = getFirestore(app)

export {app, auth, db, storage, fireStore}