// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import "firebase/compat/auth"
import "firebase/auth"
import "firebase/storage"
import "firebase/analytics"
import "firebase/performance"
import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig2 = {
    apiKey: "AIzaSyCXL_sq54LT0pYzPvwQyNnHYcz3fXq-Pus",
    authDomain: "new-s3.firebaseapp.com",
    projectId: "new-s3",
    storageBucket: "new-s3.appspot.com",
    messagingSenderId: "161006405358",
    appId: "1:161006405358:web:45a1b7326e8f37e42395ff"
};
  

// Initialize Firebase
const app2 = initializeApp(firebaseConfig2, 'app2')
const storage2 = getStorage(app2)

export {app2, storage2}