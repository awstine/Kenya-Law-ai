document.addEventListener('DOMContentLoaded', function() {
    console.log("Feedback submission script loaded");
    
    // Get DOM elements
    const openFeedbackBtn = document.getElementById('open-feedback');
    const feedbackModal = document.getElementById('feedback-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const stars = document.querySelectorAll('.star');
    const submitBtn = document.getElementById('submit-feedback');
    const feedbackText = document.getElementById('feedback-text');
    const ratingText = document.querySelector('.rating-text');
    
    let currentRating = 0;
    
    // Debug - check if elements are found
    console.log("Feedback button:", openFeedbackBtn);
    console.log("Feedback modal:", feedbackModal);
    console.log("Stars found:", stars.length);
    
    // Get current user info
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Open feedback modal
    openFeedbackBtn.addEventListener('click', function() {
        console.log("Opening feedback modal");
        feedbackModal.style.display = 'flex';
    });
    
    // Close modal when clicking X
    closeModalBtn.addEventListener('click', function() {
        feedbackModal.style.display = 'none';
        resetFeedbackForm();
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target == feedbackModal) {
            feedbackModal.style.display = 'none';
            resetFeedbackForm();
        }
    });
    
    // Handle star rating
    stars.forEach(star => {
        star.addEventListener('click', function() {
            console.log("Star clicked:", this.getAttribute('data-rating'));
            
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
            updateRatingText(rating);
            
            // Enable submit button if there's also feedback text
            if (feedbackText.value.trim().length > 0) {
                submitBtn.disabled = false;
            }
        });
    });
    
    // Handle text input
    feedbackText.addEventListener('input', function() {
        // Enable submit button if there's text and a rating
        if (this.value.trim().length > 0 && currentRating > 0) {
            submitBtn.disabled = false;
        } else {
            submitBtn.disabled = true;
        }
    });
    
    // Submit feedback
    submitBtn.addEventListener('click', function() {
        console.log("Submitting feedback with rating:", currentRating);
        
        const feedback = {
            id: Date.now(),
            rating: currentRating,
            comment: feedbackText.value.trim(),
            username: currentUser.username || 'Anonymous User',
            email: currentUser.email || 'unknown',
            timestamp: new Date().toISOString()
        };
        
        // Save feedback to localStorage
        saveFeedback(feedback);
        
        // Show confirmation and close
        alert('Thank you for your feedback!');
        feedbackModal.style.display = 'none';
        resetFeedbackForm();
    });
    
    // Helper function to update rating text
    function updateRatingText(rating) {
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
    
    // Helper function to save feedback
    function saveFeedback(feedback) {
        // Get existing feedback or initialize new array
        let allFeedback = JSON.parse(localStorage.getItem('user_feedback') || '[]');
        
        // Add new feedback
        allFeedback.push(feedback);
        
        // Save back to localStorage
        localStorage.setItem('user_feedback', JSON.stringify(allFeedback));
        
        console.log("Feedback saved. Total items:", allFeedback.length);
        
        // Verify it was saved
        try {
            const verify = JSON.parse(localStorage.getItem('user_feedback') || '[]');
            console.log("Verified feedback count:", verify.length);
        } catch (e) {
            console.error("Error verifying save:", e);
        }
    }
    
    // Reset form after submission or closing
    function resetFeedbackForm() {
        currentRating = 0;
        feedbackText.value = '';
        submitBtn.disabled = true;
        stars.forEach(s => s.classList.remove('active'));
        ratingText.textContent = 'Select your rating';
    }
});