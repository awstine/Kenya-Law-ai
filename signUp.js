function signup() {
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (username && email && password) {
        // Store user data in localStorage (simulating authentication)
        localStorage.setItem("user", JSON.stringify({ username, email }));
        alert("Signup successful!");
        window.location.href = "law.html"; // Redirect to chatbot page
    } else {
        alert("Please fill all fields.");
    }
}
