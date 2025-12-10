// Firebase imports (make sure you have installed Firebase and added SDK)
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, OAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

// TODO: Replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBn9lydLPUSAW32KJIXDL_6BkXMDkxtCB4",
    authDomain: "healthnest-26102011.firebaseapp.com",
    projectId: "healthnest-26102011",
    storageBucket: "healthnest-26102011.firebasestorage.app",
    messagingSenderId: "120860249182",
    appId: "1:120860249182:web:82f943900a9f414a74f8cf",
    measurementId: "G-2QR1N28RP6"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

// DOM Elements
const signInBtn = document.querySelector('.btn-signing');
const userBox = document.createElement('div');
userBox.classList.add('user-box');
document.body.appendChild(userBox);

// Default profile photo
const defaultPhoto = 'default-profile.jpg'; // Place your default photo in project folder

// Functions to handle login
async function login(provider) {
  try {
    await signInWithPopup(auth, provider);
  } catch (err) {
    console.error(err);
    alert("Login failed: " + err.message);
  }
}

// Google Login
document.querySelector('.google-login')?.addEventListener('click', () => login(googleProvider));

// GitHub Login
document.querySelector('.github-login')?.addEventListener('click', () => login(githubProvider));

// Microsoft Login
document.querySelector('.microsoft-login')?.addEventListener('click', () => login(microsoftProvider));

// Logout function
function logoutUser() {
  signOut(auth).catch(err => console.error(err));
}

// Monitor auth state
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Hide signing button
    if (signInBtn) signInBtn.style.display = 'none';

    // Show user box
    userBox.innerHTML = `
      <img src="${user.photoURL || defaultPhoto}" alt="profile" class="user-photo">
      <div class="user-info">
        <p class="user-name">${user.displayName || "Anonymous"}</p>
        <p class="user-email">${user.email}</p>
        <button class="logout-btn">Logout</button>
      </div>
    `;
    userBox.style.display = 'flex';

    // Add logout listener
    userBox.querySelector('.logout-btn').addEventListener('click', logoutUser);
  } else {
    // User logged out
    if (signInBtn) signInBtn.style.display = 'block';
    userBox.style.display = 'none';
    userBox.innerHTML = '';
  }
});
