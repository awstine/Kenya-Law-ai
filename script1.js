
// Get the logout button element
const logoutBtn = document.getElementById('logout-btn');

// Add an event listener to the logout button
logoutBtn.addEventListener('click', function() {
    // Redirect to the login screen
    window.location.href = 'login.html';
});

document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Perform any validation or other logic here

    // Redirect to the login page
    window.location.href = 'login.html';
  });