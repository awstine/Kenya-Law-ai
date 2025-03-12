
// Get the logout button element
const logoutBtn = document.getElementById('logout-btn');

// Add an event listener to the logout button
logoutBtn.addEventListener('click', function() {
    // Redirect to the login screen
    window.location.href = 'login.html';
});