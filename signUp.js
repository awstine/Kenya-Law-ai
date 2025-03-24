document.addEventListener('DOMContentLoaded', function() {
    // Get form and form elements
    const form = document.querySelector('form');
    const nameInput = document.querySelector('.name');
    const usernameInput = document.querySelector('.username');
    const emailInput = document.querySelector('.email');
    const passwordInput = document.querySelector('.password');
    const cPasswordInput = document.querySelector('.cPassword');
    
    // Password visibility toggles
    const toggleButtons = document.querySelectorAll('.show-hide');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.parentElement.querySelector('input');
            if (input.type === 'password') {
                input.type = 'text';
                button.classList.replace('bx-hide', 'bx-show');
            } else {
                input.type = 'password';
                button.classList.replace('bx-show', 'bx-hide');
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        
        // Validate form
        if (validateForm()) {
            // Store user data in localStorage
            saveUser({
                name: nameInput.value.trim(),
                username: usernameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value // In a real app, you'd want to hash this
            });
            
            // Show success message
            alert('Signup successful! You can now login.');
            
            // Redirect to login page
            window.location.href = 'login.html';
        }
    });
    
    // Form validation
    function validateForm() {
        let isValid = true;
        
        // Name validation
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'Name cannot be empty');
            isValid = false;
        } else {
            hideError(nameInput);
        }
        
        // Username validation
        if (usernameInput.value.trim() === '') {
            showError(usernameInput, 'Username cannot be empty');
            isValid = false;
        } else if (usernameInput.value.length < 3) {
            showError(usernameInput, 'Username must be at least 3 characters');
            isValid = false;
        } else {
            hideError(usernameInput);
        }
        
        // Email validation
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        if (!emailInput.value.match(emailPattern)) {
            showError(emailInput, 'Please enter a valid email');
            isValid = false;
        } else {
            hideError(emailInput);
        }
        
        // Password validation
        if (passwordInput.value === '') {
            showError(passwordInput, 'Password cannot be empty');
            isValid = false;
        } else if (passwordInput.value.length < 8) {
            showError(passwordInput, 'Password must be at least 8 characters');
            isValid = false;
        } else {
            hideError(passwordInput);
        }
        
        // Confirm password validation
        if (cPasswordInput.value === '') {
            showError(cPasswordInput, 'Please confirm your password');
            isValid = false;
        } else if (cPasswordInput.value !== passwordInput.value) {
            showError(cPasswordInput, 'Passwords do not match');
            isValid = false;
        } else {
            hideError(cPasswordInput);
        }
        
        return isValid;
    }
    
    // Helper functions
    function showError(input, message) {
        const fieldParent = input.parentElement.parentElement;
        const errorDisplay = fieldParent.querySelector('.error');
        const errorText = errorDisplay.querySelector('.error-text');
        
        errorText.innerText = message;
        fieldParent.classList.add('invalid');
    }
    
    function hideError(input) {
        const fieldParent = input.parentElement.parentElement;
        fieldParent.classList.remove('invalid');
    }
    
    function saveUser(userData) {
        // Check if users array exists in localStorage
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Add new user to array
        users.push(userData);
        
        // Save back to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Also save as current user
        localStorage.setItem('user', JSON.stringify({
            username: userData.username,
            email: userData.email
        }));
    }
});
