// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
// import { getFirestore, setDoc, doc } from "firebase/firestore";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyAoQEyfcaUTYwYsZXcKtaYYYtk7dBapHeA",
//   authDomain: "kenya-law-chatbot.firebaseapp.com",
//   projectId: "kenya-law-chatbot",
//   storageBucket: "kenya-law-chatbot.firebasestorage.app",
//   messagingSenderId: "1071459759295",
//   appId: "1:1071459759295:web:b2e6c1348dc917865a420a",
//   measurementId: "G-ZYSC5K2CKZ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const auth = getAuth(app);
// const db = getFirestore(app);

// // Wait for DOM to be fully loaded
// document.addEventListener('DOMContentLoaded', () => {
//   console.log("Firebase auth script loaded");
  
//   const signUpButton = document.getElementById('submit');
  
//   if (signUpButton) {
//     console.log("Found submit button");
    
//     signUpButton.addEventListener('click', (event) => {
//       event.preventDefault();
//       console.log("Sign up button clicked");
      
//       // Get form values
//       const email = document.getElementById('email').value;
//       const password = document.getElementById('password').value;
//       const username = document.getElementById('username').value;
//       const name = document.getElementById('name')?.value || username; // Optional name field
      
//       console.log("Form data:", { email, username, name });
      
//       // Show loading state
//       signUpButton.disabled = true;
//       signUpButton.textContent = 'Creating account...';
      
//       // Create user with Firebase
//       createUserWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {
//           const user = userCredential.user;
//           console.log('User created successfully:', user.uid);
          
//           // Add user data to Firestore
//           return setDoc(doc(db, "users", user.uid), {
//             name: name,
//             username: username,
//             email: email,
//             createdAt: new Date().toISOString()
//           });
//         })
//         .then(() => {
//           console.log('User document created in Firestore');
          
//           // Store some user info in localStorage for the app to use
//           localStorage.setItem('user', JSON.stringify({
//             email: email,
//             username: username,
//             name: name
//           }));
          
//           // Show success message
//           alert('Account created successfully! Redirecting to login...');
          
//           // Redirect to login page
//           window.location.href = 'login.html';
//         })
//         .catch((error) => {
//           console.error('Error creating user:', error);
          
//           let errorMessage = 'Failed to create account';
          
//           // Provide specific error messages based on Firebase error codes
//           switch (error.code) {
//             case 'auth/email-already-in-use':
//               errorMessage = 'This email is already registered.';
//               break;
//             case 'auth/invalid-email':
//               errorMessage = 'Please provide a valid email address.';
//               break;
//             case 'auth/weak-password':
//               errorMessage = 'Password is too weak. Use at least 6 characters.';
//               break;
//             default:
//               errorMessage = `Error: ${error.message}`;
//           }
          
//           alert(errorMessage);
//         })
//         .finally(() => {
//           // Reset button state
//           signUpButton.disabled = false;
//           signUpButton.textContent = 'Sign Up';
//         });
//     });
//   } else {
//     console.warn("Submit button not found. Make sure the DOM is loaded.");
//   }
// });