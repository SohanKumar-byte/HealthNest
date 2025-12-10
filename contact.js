// contact.js (BEGINNER VERSION)

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// -------------------------
// 1. YOUR FIREBASE CONFIG
// -------------------------
const firebaseConfig = {
    apiKey: "AIzaSyBn9lydLPUSAW32KJIXDL_6BkXMDkxtCB4",
    authDomain: "healthnest-26102011.firebaseapp.com",
    projectId: "healthnest-26102011",
    storageBucket: "healthnest-26102011.firebasestorage.app",
    messagingSenderId: "120860249182",
    appId: "1:120860249182:web:82f943900a9f414a74f8cf",
    measurementId: "G-2QR1N28RP6"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// -------------------------
// 2. FORM SUBMISSION
// -------------------------
const form = document.querySelector("#contact form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = form.querySelector("input[type='text']").value;
  const email = form.querySelector("input[type='email']").value;
  const message = form.querySelector("textarea").value;

  try {
    await addDoc(collection(db, "messages"), {
      name: name,
      email: email,
      message: message,
      createdAt: new Date()
    });

    alert("Message sent successfully!");

    form.reset(); // Clear form

  } catch (error) {
    console.log("Error sending message:", error);
    alert("Error! Check console.");
  }
});
