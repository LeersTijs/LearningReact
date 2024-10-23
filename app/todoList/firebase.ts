import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBk9nnP8q7fuWNXlkuba17KQ11eXL3v4lg",
    authDomain: "firstproject-9cad0.firebaseapp.com",
    projectId: "firstproject-9cad0",
    storageBucket: "firstproject-9cad0.appspot.com",
    messagingSenderId: "944107521940",
    appId: "1:944107521940:web:d10591bd563613d47e3181",
    measurementId: "G-LPNCWZ4QRT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {auth, app, db, storage}