import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { setDoc, doc, getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyD1qbHJvh3ttDwjABcqneXEVVXN7yoVBHs",
    authDomain: "mental-health-24e18.firebaseapp.com",
    projectId: "mental-health-24e18",
    storageBucket: "mental-health-24e18.appspot.com",
    messagingSenderId: "1026169938027",
    appId: "1:1026169938027:web:8f328050627a051818112e",
    measurementId: "G-36781PKK5G"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);
const storage = getStorage(app);



export { app, auth, db, storage };
