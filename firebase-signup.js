// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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
  console.log("Firebase signup script loaded");
  
  // Get form and error message elements
  const form = document.getElementById('signup-form');
  const errorMessage = document.getElementById('error-message');
  
  if (form) {
    // Form validation functions
    const validatePassword = () => {
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      
      if (password.length < 6) {
        showError('Password must be at least 6 characters long');
        return false;
      }
      
      if (password !== confirmPassword) {
        showError('Passwords do not match');
        return false;
      }
      
      return true;
    };
    
    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    };
    
    const showError = (message) => {
      errorMessage.textContent = message;
      errorMessage.style.display = 'block';
    };
    
    const clearError = () => {
      errorMessage.textContent = '';
      errorMessage.style.display = 'none';
    };
    
    // Handle form submission
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearError();
      
      // Get form values
      const name = document.getElementById('name').value;
      const username = document.getElementById('username').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Simple validation
      if (!name || !username || !email || !password) {
        showError('All fields are required');
        return;
      }
      
      if (!validateEmail(email)) {
        showError('Please enter a valid email address');
        return;
      }
      
      if (!validatePassword()) {
        return; // Error is shown in validatePassword function
      }
      
      // Disable submit button
      const submitButton = document.getElementById('submit');
      submitButton.disabled = true;
      submitButton.value = 'Creating Account...';
      
      try {
        console.log('Creating user with:', { email, password });
        
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        console.log('User created with ID:', user.uid);
        
        // Add user data to Firestore
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          username: username,
          email: email,
          createdAt: new Date().toISOString()
        });
        
        console.log('User data saved to Firestore');
        
        // Save user to localStorage
        localStorage.setItem('user', JSON.stringify({
          uid: user.uid,
          name: name,
          username: username,
          email: email
        }));
        
        // Redirect to login page
        alert('Account created successfully!');
        window.location.href = 'login.html';
        
      } catch (error) {
        console.error('Error during signup:', error);
        
        // Handle Firebase auth errors
        switch(error.code) {
          case 'auth/email-already-in-use':
            showError('This email is already registered');
            break;
          case 'auth/invalid-email':
            showError('Invalid email address');
            break;
          case 'auth/operation-not-allowed':
            showError('Email/password accounts are not enabled');
            break;
          case 'auth/weak-password':
            showError('Password is too weak');
            break;
          default:
            showError(`Error: ${error.message}`);
        }
      } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.value = 'Sign Up';
      }
    });
  } else {
    console.error('Signup form not found in the DOM');
  }
});