// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

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

document.addEventListener('DOMContentLoaded', () => {
  console.log("Password reset page loaded");
  
  const resetForm = document.getElementById('reset-form');
  const errorMessage = document.getElementById('error-message');
  const successMessage = document.getElementById('success-message');
  
  if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Hide any previous messages
      errorMessage.style.display = 'none';
      successMessage.style.display = 'none';
      
      const email = document.getElementById('email').value;
      
      if (!email) {
        errorMessage.textContent = 'Please enter your email address';
        errorMessage.style.display = 'block';
        return;
      }
      
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errorMessage.textContent = 'Please enter a valid email address';
        errorMessage.style.display = 'block';
        return;
      }
      
      // Disable the button during processing
      const resetButton = document.getElementById('reset-button');
      resetButton.disabled = true;
      resetButton.value = 'Sending...';
      
      try {
        // Send password reset email
        await sendPasswordResetEmail(auth, email);
        
        // Show success message
        successMessage.textContent = 'Password reset email sent! Check your inbox for further instructions.';
        successMessage.style.display = 'block';
        
        // Clear the email field
        document.getElementById('email').value = '';
        
      } catch (error) {
        console.error('Password reset error:', error);
        
        // Handle specific Firebase errors
        switch(error.code) {
          case 'auth/user-not-found':
            errorMessage.textContent = 'No account found with this email address';
            break;
          case 'auth/invalid-email':
            errorMessage.textContent = 'Invalid email format';
            break;
          case 'auth/too-many-requests':
            errorMessage.textContent = 'Too many requests. Please try again later';
            break;
          default:
            errorMessage.textContent = `Error: ${error.message}`;
        }
        
        errorMessage.style.display = 'block';
      } finally {
        // Re-enable the button
        resetButton.disabled = false;
        resetButton.value = 'Send Reset Link';
      }
    });
  } else {
    console.error('Reset form not found');
  }
});