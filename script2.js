document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.querySelector('form');
  const emailInput = document.querySelector('.email');
  const passwordInput = document.querySelector('.password');
  const errorText = document.querySelector('.error-text');
  
  // Show/hide password functionality
  const togglePassword = document.querySelector('.show-hide');
  if (togglePassword) {
      togglePassword.addEventListener('click', () => {
          if (passwordInput.type === 'password') {
              passwordInput.type = 'text';
              togglePassword.classList.replace('bx-hide', 'bx-show');
          } else {
              passwordInput.type = 'password';
              togglePassword.classList.replace('bx-show', 'bx-hide');
          }
      });
  }
  
  // Handle login form submission
  loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find user with matching email and password
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
          // Store current user in localStorage
          localStorage.setItem('user', JSON.stringify({
              username: user.username,
              email: user.email
          }));
          
          // Redirect to law chatbot page
          window.location.href = 'law.html';
      } else {
          // Show error
          showError('Invalid email or password');
      }
  });
  
  function showError(message) {
      errorText.textContent = message;
      loginForm.classList.add('invalid');
  }
});