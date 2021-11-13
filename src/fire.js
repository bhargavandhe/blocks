// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "AIzaSyC86_YeAQQgdkxrAuAQ1-AoOAsbXIo3zTk",
  authDomain: "blocks-868c3.firebaseapp.com",
  projectId: "blocks-868c3",
  storageBucket: "blocks-868c3.appspot.com",
  messagingSenderId: "355129895198",
  appId: "1:355129895198:web:7de9d95446da1088ce410f",
  measurementId: "G-23H14BP2GM",
});

const db = app.firestore();
export { db };
