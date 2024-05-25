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
    apiKey: "AIzaSyAxliEEDtzHEWbqBz59IxMa_e4rv6YMxy8",
    authDomain: "new-atld.firebaseapp.com",
    projectId: "new-atld",
    storageBucket: "new-atld.appspot.com",
    messagingSenderId: "331909781752",
    appId: "1:331909781752:web:c5a802cea44f746ca5830d"
};
  

// Initialize Firebase
const app2 = initializeApp(firebaseConfig2, 'app2')
const storage2 = getStorage(app2)

export {app2, storage2}