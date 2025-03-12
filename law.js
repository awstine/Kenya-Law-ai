let user = localStorage.getItem("user");

if (!user) {
    alert("You need to sign up first!");
    window.location.href = "signup.html"; // Redirect to signup page
} else {
    let userData = JSON.parse(user);
    let greetingElement = document.getElementById("greeting");
    
    if (greetingElement) {
        greetingElement.innerText = `Hello, ${userData.username}! Welcome to Kenyan Law Advisor`;
    }
}

// Sign Out functionality
document.getElementById("logout-btn").addEventListener("click", function() {
    localStorage.removeItem("user"); // Remove user data
    window.location.href = "login.html"; // Redirect to signup page
});
