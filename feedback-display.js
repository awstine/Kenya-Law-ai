document.addEventListener('DOMContentLoaded', function() {
    console.log("Feedback dashboard loading...");
    
    // Get DOM elements
    const feedbackContainer = document.getElementById('feedback-container');
    const filterRating = document.getElementById('filter-rating');
    const clearFeedbackBtn = document.getElementById('clear-feedback');
    const totalCountEl = document.getElementById('total-count');
    const averageRatingEl = document.getElementById('average-rating');
    const fiveStarCountEl = document.getElementById('five-star-count');
    const recentCountEl = document.getElementById('recent-count');
    
    // Debug check for DOM elements
    console.log("Container:", feedbackContainer);
    console.log("Filter:", filterRating);
    
    // Load and display feedback
    loadFeedback();
    
    // Event listeners
    if (filterRating) {
        filterRating.addEventListener('change', loadFeedback);
    }
    
    if (clearFeedbackBtn) {
        clearFeedbackBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete ALL feedback? This cannot be undone.')) {
                localStorage.setItem('user_feedback', '[]');
                loadFeedback();
            }
        });
    }
    
    // Load feedback from localStorage
    function loadFeedback() {
        console.log("Loading feedback data...");
        
        try {
            // Get the raw string from localStorage
            const feedbackString = localStorage.getItem('user_feedback');
            console.log("Raw feedback data:", feedbackString);
            
            // Parse the data or default to empty array
            let allFeedback = [];
            
            if (feedbackString) {
                allFeedback = JSON.parse(feedbackString);
                if (!Array.isArray(allFeedback)) {
                    console.error("Feedback data is not an array:", allFeedback);
                    allFeedback = [];
                }
            }
            
            console.log("Parsed feedback count:", allFeedback.length);
            
            // Update stats
            updateStats(allFeedback);
            
            // If no container, exit early
            if (!feedbackContainer) {
                console.error("No feedback container found!");
                return;
            }
            
            // Filter by rating if needed
            const filterValue = filterRating ? filterRating.value : 'all';
            let filteredFeedback = allFeedback;
            
            if (filterValue !== 'all') {
                const ratingFilter = parseInt(filterValue);
                filteredFeedback = allFeedback.filter(item => item.rating === ratingFilter);
            }
            
            // Sort by newest first
            filteredFeedback.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            // Display feedback
            if (filteredFeedback.length === 0) {
                feedbackContainer.innerHTML = `
                    <div class="empty-feedback">
                        <p>No feedback found.</p>
                        <p class="debug-note">Total entries in storage: ${allFeedback.length}</p>
                        <button id="manual-refresh" class="secondary-btn">Refresh Data</button>
                    </div>
                `;
                
                document.getElementById('manual-refresh').addEventListener('click', loadFeedback);
                return;
            }
            
            let feedbackHTML = '';
            
            filteredFeedback.forEach(item => {
                // Format date
                const date = new Date(item.timestamp);
                const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
                
                // Generate stars HTML
                let starsHTML = '';
                for (let i = 1; i <= 5; i++) {
                    if (i <= item.rating) {
                        starsHTML += '★';
                    } else {
                        starsHTML += '☆';
                    }
                }
                
                feedbackHTML += `
                    <div class="feedback-card" data-id="${item.id}">
                        <div class="feedback-meta">
                            <div class="rating">${starsHTML}</div>
                            <div class="user">${item.username}</div>
                            <div class="date">${formattedDate}</div>
                        </div>
                        <div class="feedback-content">
                            <div class="comment">${item.comment}</div>
                            <div class="actions">
                                <button class="delete-feedback" data-id="${item.id}">Delete</button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            feedbackContainer.innerHTML = feedbackHTML;
            
            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-feedback').forEach(button => {
                button.addEventListener('click', function() {
                    const id = this.getAttribute('data-id');
                    deleteFeedback(id);
                });
            });
            
        } catch (error) {
            console.error("Error loading feedback:", error);
            if (feedbackContainer) {
                feedbackContainer.innerHTML = `
                    <div class="empty-feedback">
                        <p>Error loading feedback data.</p>
                        <p class="error-details">${error.message}</p>
                        <button id="manual-refresh" class="secondary-btn">Try Again</button>
                    </div>
                `;
                
                document.getElementById('manual-refresh').addEventListener('click', loadFeedback);
            }
        }
    }
    
    // Delete specific feedback
    function deleteFeedback(id) {
        if (confirm('Are you sure you want to delete this feedback?')) {
            // Get current feedback
            let allFeedback = JSON.parse(localStorage.getItem('user_feedback') || '[]');
            
            // Filter out the one to delete
            allFeedback = allFeedback.filter(item => item.id != id);
            
            // Save back to localStorage
            localStorage.setItem('user_feedback', JSON.stringify(allFeedback));
            
            // Reload the display
            loadFeedback();
        }
    }
    
    // Update statistics
    function updateStats(allFeedback) {
        if (!totalCountEl) return;
        
        // Total count
        totalCountEl.textContent = allFeedback.length;
        
        // Average rating
        if (allFeedback.length > 0) {
            const sum = allFeedback.reduce((total, item) => total + item.rating, 0);
            const average = (sum / allFeedback.length).toFixed(1);
            averageRatingEl.textContent = average;
        } else {
            averageRatingEl.textContent = '0.0';
        }
        
        // 5-star count
        const fiveStarCount = allFeedback.filter(item => item.rating === 5).length;
        fiveStarCountEl.textContent = fiveStarCount;
        
        // Recent count (last 7 days)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const recentCount = allFeedback.filter(item => {
            const itemDate = new Date(item.timestamp);
            return itemDate > oneWeekAgo;
        }).length;
        
        recentCountEl.textContent = recentCount;
    }
    
    // For debugging - expose a function to manually check storage
    window.checkFeedbackData = function() {
        console.log("MANUAL CHECK:");
        try {
            const data = localStorage.getItem('user_feedback');
            console.log("Raw data:", data);
            if (data) {
                const parsed = JSON.parse(data);
                console.log("Parsed data:", parsed);
                console.log("Items:", parsed.length);
                return `Found ${parsed.length} items`;
            } else {
                return "No data found";
            }
        } catch (e) {
            console.error("Error checking data:", e);
            return "Error: " + e.message;
        }
    };
});