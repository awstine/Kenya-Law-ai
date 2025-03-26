// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

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
console.log("Initializing Firebase...");
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
console.log("Firebase initialized");

document.addEventListener('DOMContentLoaded', function() {
    console.log("Firebase feedback script loaded");
    
    // Get DOM elements
    const openFeedbackBtn = document.getElementById('open-feedback');
    const feedbackModal = document.getElementById('feedback-modal');
    const submitBtn = document.getElementById('submit-feedback');
    const feedbackText = document.getElementById('feedback-text');
    const stars = document.querySelectorAll('.star');
    const ratingText = document.querySelector('.rating-text');
    const closeModalBtn = document.querySelector('.close-modal');
    
    let currentRating = 0;
    
    // Debug logging
    console.log("Feedback button:", openFeedbackBtn);
    console.log("Submit button:", submitBtn);
    console.log("Stars:", stars ? stars.length : 0);
    
    // Get current user info from localStorage
    const getCurrentUser = () => {
        try {
            const userData = localStorage.getItem('user');
            if (!userData) return {};
            return JSON.parse(userData);
        } catch (error) {
            console.error("Error parsing user data:", error);
            return {};
        }
    };
    
    // Open feedback modal
    if (openFeedbackBtn) {
        openFeedbackBtn.addEventListener('click', function() {
            console.log("Opening feedback modal");
            feedbackModal.style.display = 'flex';
        });
    }
    
    // Close modal when clicking X
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            feedbackModal.style.display = 'none';
            resetFeedbackForm();
        });
    }
    
    // Close modal when clicking outside
    if (feedbackModal) {
        window.addEventListener('click', function(event) {
            if (event.target == feedbackModal) {
                feedbackModal.style.display = 'none';
                resetFeedbackForm();
            }
        });
    }
    
    // Handle star rating
    if (stars && stars.length > 0) {
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                currentRating = rating;
                
                // Update star display
                stars.forEach(s => {
                    if (parseInt(s.getAttribute('data-rating')) <= rating) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
                
                // Update rating text
                if (ratingText) {
                    updateRatingText(rating);
                }
                
                // Enable submit button if there's also feedback text
                if (submitBtn && feedbackText && feedbackText.value.trim().length > 0) {
                    submitBtn.disabled = false;
                }
            });
        });
    }
    
    // Handle text input
    if (feedbackText) {
        feedbackText.addEventListener('input', function() {
            // Enable submit button if there's text and a rating
            if (submitBtn) {
                submitBtn.disabled = !(this.value.trim().length > 0 && currentRating > 0);
            }
        });
    }
    
    // Submit feedback
    if (submitBtn) {
        submitBtn.addEventListener('click', async function() {
            console.log("Submitting feedback with rating:", currentRating);
            
            // Disable submit button
            submitBtn.disabled = true;
            submitBtn.innerText = 'Submitting...';
            
            const currentUser = getCurrentUser();
            console.log("Current user:", currentUser);
            
            try {
                // Create feedback object
                const feedbackData = {
                    rating: currentRating,
                    comment: feedbackText.value.trim(),
                    username: currentUser.username || currentUser.name || currentUser.email || 'Anonymous User',
                    email: currentUser.email || 'anonymous',
                    userId: currentUser.uid || null,
                    createdAt: serverTimestamp() // Use server timestamp instead
                };
                
                console.log("Submitting feedback data:", feedbackData);
                
                // Save to Firebase
                const docRef = await addDoc(collection(db, "feedback"), feedbackData);
                console.log("Feedback saved to Firebase with ID:", docRef.id);
                
                // Also save to localStorage for backward compatibility
                saveFeedbackToLocalStorage({
                    ...feedbackData,
                    timestamp: new Date().toISOString() // Use client timestamp for localStorage
                });
                
                // Show confirmation
                alert('Thank you for your feedback!');
                
                // Close modal
                feedbackModal.style.display = 'none';
                resetFeedbackForm();
                
            } catch (error) {
                console.error("Error saving feedback:", error);
                alert('Error submitting feedback: ' + error.message);
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerText = 'Submit Feedback';
            }
        });
    }
    
    // Helper function to update rating text
    function updateRatingText(rating) {
        if (!ratingText) return;
        
        const texts = [
            'Select your rating',
            'Poor - Did not meet expectations',
            'Fair - Needs improvement',
            'Good - Met expectations',
            'Very Good - Exceeded expectations',
            'Excellent - Outstanding experience'
        ];
        
        ratingText.textContent = texts[rating];
    }
    
    // Helper function to save feedback to localStorage
    function saveFeedbackToLocalStorage(feedback) {
        try {
            // Add ID
            const localFeedback = {
                ...feedback,
                id: Date.now()
            };
            
            // Get existing feedback or initialize new array
            let allFeedback = [];
            try {
                allFeedback = JSON.parse(localStorage.getItem('user_feedback') || '[]');
                if (!Array.isArray(allFeedback)) allFeedback = [];
            } catch (e) {
                console.error("Error parsing existing feedback:", e);
                allFeedback = [];
            }
            
            // Add new feedback
            allFeedback.push(localFeedback);
            
            // Save back to localStorage
            localStorage.setItem('user_feedback', JSON.stringify(allFeedback));
            console.log("Feedback also saved to localStorage. Total items:", allFeedback.length);
        } catch (e) {
            console.error("Error saving to localStorage:", e);
        }
    }
    
    // Reset form after submission or closing
    function resetFeedbackForm() {
        if (!feedbackText) return;
        
        currentRating = 0;
        feedbackText.value = '';
        
        if (submitBtn) {
            submitBtn.disabled = true;
        }
        
        if (stars) {
            stars.forEach(s => s.classList.remove('active'));
        }
        
        if (ratingText) {
            ratingText.textContent = 'Select your rating';
        }
    }
    
    // For feedback.html - fetch feedback from Firebase
    const feedbackContainer = document.getElementById('feedback-container');
    
    if (feedbackContainer) {
        console.log("Feedback container found, loading feedback");
        // Try loading from Firebase first, fall back to localStorage
        loadFeedbackFromFirebase().catch(error => {
            console.error("Error loading from Firebase:", error);
            console.log("Falling back to localStorage");
            loadFeedbackFromLocalStorage();
        });
    }
    
    // Load feedback from Firebase
    async function loadFeedbackFromFirebase() {
        try {
            console.log("Loading feedback from Firebase...");
            
            // Show loading indicator
            feedbackContainer.innerHTML = '<div class="loading">Loading feedback from Firebase...</div>';
            
            // Get feedback from Firestore
            const q = query(collection(db, "feedback"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            
            console.log("Firebase query completed, documents:", querySnapshot.size);
            
            if (querySnapshot.empty) {
                feedbackContainer.innerHTML = '<div class="empty-feedback">No feedback found in Firebase. Checking localStorage...</div>';
                
                // Fall back to localStorage
                const localFeedback = JSON.parse(localStorage.getItem('user_feedback') || '[]');
                if (localFeedback.length > 0) {
                    console.log("Found feedback in localStorage, displaying");
                    displayFeedback(localFeedback);
                    updateStats(localFeedback);
                    return;
                }
                
                feedbackContainer.innerHTML = '<div class="empty-feedback">No feedback found.</div>';
                updateStats([]);
                return;
            }
            
            // Process feedback data
            const feedbackItems = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                feedbackItems.push({
                    id: doc.id,
                    ...data,
                    timestamp: data.createdAt ? data.createdAt.toDate() : new Date() // Convert Firestore timestamp to JS Date
                });
            });
            
            console.log("Processed feedback items:", feedbackItems.length);
            
            // Update stats
            updateStats(feedbackItems);
            
            // Display feedback
            displayFeedback(feedbackItems);
            
        } catch (error) {
            console.error("Error loading from Firebase:", error);
            feedbackContainer.innerHTML = `
                <div class="error-message">
                    Firebase Error: ${error.message}. Checking localStorage...
                </div>
            `;
            throw error; // Let the calling function handle the fallback
        }
    }
    
    // Load feedback from localStorage
    function loadFeedbackFromLocalStorage() {
        try {
            console.log("Loading feedback from localStorage");
            
            // Get feedback from localStorage
            const localFeedback = JSON.parse(localStorage.getItem('user_feedback') || '[]');
            
            console.log("Found items in localStorage:", localFeedback.length);
            
            if (localFeedback.length === 0) {
                feedbackContainer.innerHTML = '<div class="empty-feedback">No feedback found in localStorage either.</div>';
                updateStats([]);
                return;
            }
            
            // Sort by timestamp (newest first)
            localFeedback.sort((a, b) => {
                return new Date(b.timestamp) - new Date(a.timestamp);
            });
            
            // Update stats
            updateStats(localFeedback);
            
            // Display feedback
            displayFeedback(localFeedback);
            
        } catch (error) {
            console.error("Error loading from localStorage:", error);
            feedbackContainer.innerHTML = `
                <div class="error-message">
                    Failed to load feedback from both Firebase and localStorage: ${error.message}
                </div>
            `;
        }
    }
    
    // Display feedback in container
    function displayFeedback(items) {
        if (!feedbackContainer) return;
        
        if (items.length === 0) {
            feedbackContainer.innerHTML = '<div class="empty-feedback">No feedback found.</div>';
            return;
        }
        
        let html = '';
        
        items.forEach(item => {
            // Format date
            const date = item.timestamp instanceof Date ? item.timestamp : new Date(item.timestamp);
            const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            
            // Generate stars
            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
                starsHtml += i <= item.rating ? '★' : '☆';
            }
            
            // Create feedback card
            html += `
                <div class="feedback-card" data-id="${item.id}">
                    <div class="feedback-meta">
                        <div class="rating">${starsHtml}</div>
                        <div class="user">${item.username || 'Anonymous User'}</div>
                        <div class="date">${formattedDate}</div>
                    </div>
                    <div class="feedback-content">
                        <div class="comment">${item.comment || ''}</div>
                    </div>
                </div>
            `;
        });
        
        feedbackContainer.innerHTML = html;
    }
    
    // Update stats in dashboard
    function updateStats(items) {
        const totalCount = document.getElementById('total-count');
        const averageRating = document.getElementById('average-rating');
        const fiveStarCount = document.getElementById('five-star-count');
        const recentCount = document.getElementById('recent-count');
        
        if (!totalCount) return; // Not on stats page
        
        // Total feedback count
        totalCount.textContent = items.length;
        
        // Average rating
        if (items.length > 0) {
            const sum = items.reduce((acc, item) => acc + (item.rating || 0), 0);
            const avg = (sum / items.length).toFixed(1);
            averageRating.textContent = avg;
        } else {
            averageRating.textContent = '0.0';
        }
        
        // Five-star count
        const fiveStars = items.filter(item => item.rating === 5).length;
        fiveStarCount.textContent = fiveStars;
        
        // Recent feedback (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const recent = items.filter(item => {
            const itemDate = item.timestamp instanceof Date ? item.timestamp : new Date(item.timestamp);
            return itemDate >= oneWeekAgo;
        }).length;
        
        recentCount.textContent = recent;
    }
});