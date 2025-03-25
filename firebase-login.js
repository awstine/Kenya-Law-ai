// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoQEyfcaUTYwYsZXcKtaYYYtk7dBapHeA",
  authDomain: "kenya-law-chatbot.firebaseapp.com",
  projectId: "kenya-law-chatbot",
  storageBucket: "kenya-law-chatbot.firebasestorage.app",
  messagingSenderId: "1071459759295",
  appId: "1:1071459759295:web:b2e6c1348dc917865a420a",
  measurementId: "G-ZYSC5K2CKZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  console.log("Firebase login script loaded");
  
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');
  
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      if (errorMessage) {
        errorMessage.style.display = 'none';
      }
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      if (!email || !password) {
        if (errorMessage) {
          errorMessage.textContent = 'Email and password are required';
          errorMessage.style.display = 'block';
        }
        return;
      }
      
      const loginButton = document.querySelector('input[type="submit"]');
      if (loginButton) {
        loginButton.disabled = true;
        loginButton.value = 'Logging in...';
      }
      
      try {
        // Sign in with Firebase Auth
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('User signed in:', user.uid);
        
        // Get additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          
          let userData = {
            uid: user.uid,
            email: user.email,
            isLoggedIn: true
          };
          
          if (userDoc.exists()) {
            // Add Firestore data
            userData = {
              ...userData,
              name: userDoc.data().name,
              username: userDoc.data().username
            };
          }
          
          // Store user info in localStorage
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Redirect to main app
          window.location.href = 'law.html';
        } catch (firestoreError) {
          console.error('Error getting user data:', firestoreError);
          
          // Still store minimal user data and proceed
          localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            isLoggedIn: true
          }));
          
          window.location.href = 'law.html';
        }
      } catch (error) {
        console.error('Login error:', error);
        
        if (errorMessage) {
          // Handle specific Firebase errors
          switch(error.code) {
            case 'auth/invalid-email':
              errorMessage.textContent = 'Invalid email format';
              break;
            case 'auth/user-disabled':
              errorMessage.textContent = 'This account has been disabled';
              break;
            case 'auth/user-not-found':
              errorMessage.textContent = 'No account found with this email';
              break;
            case 'auth/wrong-password':
              errorMessage.textContent = 'Incorrect password';
              break;
            default:
              errorMessage.textContent = `Login failed: ${error.message}`;
          }
          
          errorMessage.style.display = 'block';
        }
      } finally {
        if (loginButton) {
          loginButton.disabled = false;
          loginButton.value = 'Login';
        }
      }
    });
  } else {
    console.error('Login form not found in the DOM');
  }
});