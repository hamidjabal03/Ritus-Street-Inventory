import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, doc, onSnapshot, addDoc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// TEMPELKAN KODE DARI FIREBASE CONSOLE DI SINI
const firebaseConfig = {
  apiKey: "AIzaSyB2xfDX5PU_nP5TEPSYFL6xmBcS0wZrj_c",
  authDomain: "ritus-street-inventory.firebaseapp.com",
  projectId: "ritus-street-inventory",
  storageBucket: "ritus-street-inventory.firebasestorage.app",
  messagingSenderId: "249697895281",
  appId: "1:249697895281:web:c44bccdd16958c9d28ecd0",
  measurementId: "G-MMTVPVB24E"
};

// Inisialisasi
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Ekspos ke window agar bisa dibaca App.js
window.RitusDB = { 
    db, auth, collection, doc, onSnapshot, addDoc, setDoc, getDoc, 
    signInWithEmailAndPassword, signOut, onAuthStateChanged 
};

// Logika Menghilangkan Loader
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
            setTimeout(() => loader.remove(), 400);
        }, 1000); // Memberi waktu Babel untuk transpile
    }
});
