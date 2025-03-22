// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/compat/auth"
import "firebase/auth"
import "firebase/storage"
import "firebase/analytics"
import "firebase/performance"
import { getStorage } from "firebase/storage"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig2 = {
    apiKey: process.env.REACT_APP_STORAGE_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_STORAGE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_STORAGE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_STORAGE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_STORAGE_APP_ID,
};
  

// Initialize Firebase
const app2 = initializeApp(firebaseConfig2, 'app2')
const storage2 = getStorage(app2)
const db2 = getFirestore(app2);

export {app2, storage2, db2}