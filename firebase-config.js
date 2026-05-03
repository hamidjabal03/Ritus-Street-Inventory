import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, doc, onSnapshot, addDoc, setDoc, getDoc, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2xfDX5PU_nP5TEPSYFL6xmBcS0wZrj_c",
  authDomain: "ritus-street-inventory.firebaseapp.com",
  projectId: "ritus-street-inventory",
  storageBucket: "ritus-street-inventory.firebasestorage.app",
  messagingSenderId: "249697895281",
  appId: "1:249697895281:web:c44bccdd16958c9d28ecd0",
  measurementId: "G-MMTVPVB24E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Simpan ke window agar bisa diakses index.html
window.RitusDB = { 
    db, auth, collection, doc, onSnapshot, addDoc, setDoc, getDoc, query, orderBy,
    signInWithEmailAndPassword, signOut, onAuthStateChanged 
};
