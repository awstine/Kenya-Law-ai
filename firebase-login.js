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
  
  // Get login form and error message element
  const loginForm = document.getElementById('login-form');
  const errorMessage = document.getElementById('error-message');
  
  if (loginForm) {
    console.log("Login form found");
    
    // Show error function
    const showError = (message) => {
      if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
      } else {
        alert(message); // Fallback if error element doesn't exist
      }
    };
    
    // Clear error function
    const clearError = () => {
      if (errorMessage) {
        errorMessage.textContent = '';
        errorMessage.style.display = 'none';
      }
    };
    
    // Handle form submission
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearError();
      
      // Get input values
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Basic validation
      if (!email || !password) {
        showError('Email and password are required');
        return;
      }
      
      // Disable login button
      const loginButton = document.querySelector('.button input[type="submit"]') || 
                         document.getElementById('login-button');
      
      if (loginButton) {
        loginButton.disabled = true;
        loginButton.value = 'Logging in...';
      }
      
      try {
        console.log('Attempting to sign in with:', email);
        
        // Authenticate with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('User signed in:', user.uid);
        
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            username: userData.username,
            name: userData.name,
            isLoggedIn: true
          }));
          
          console.log('User data stored in localStorage');
          
          // Redirect to the main application
          window.location.href = 'law.html';
        } else {
          console.warn('User document not found in Firestore');
          
          // Still store minimal user data
          localStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            email: user.email,
            isLoggedIn: true
          }));
          
          // Redirect to the main application
          window.location.href = 'law.html';
        }
      } catch (error) {
        console.error('Login error:', error);
        
        // Handle specific Firebase errors
        switch(error.code) {
          case 'auth/invalid-email':
            showError('Invalid email format');
            break;
          case 'auth/user-disabled':
            showError('This account has been disabled');
            break;
          case 'auth/user-not-found':
            showError('No account found with this email');
            break;
          case 'auth/wrong-password':
            showError('Incorrect password');
            break;
          default:
            showError(`Login failed: ${error.message}`);
        }
      } finally {
        // Re-enable login button
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