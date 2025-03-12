const form = document.querySelector("form"),
  emailField = form.querySelector(".email-field"),
  emailInput = emailField.querySelector(".email"),
  passField = form.querySelector(".create-password"),
  passInput = passField.querySelector(".password");

// Email Validation
function checkEmail() {
  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!emailInput.value.match(emailPattern)) {
    return emailField.classList.add("invalid");
  }
  emailField.classList.remove("invalid");
}

// Password Validation (Simplified)
function createPass() {
  const passPattern = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/;
  if (!passInput.value.match(passPattern)) {
    return passField.classList.add("invalid");
  }
  passField.classList.remove("invalid");
}

// Form Submission
form.addEventListener("submit", (e) => {
  e.preventDefault();
  checkEmail();
  createPass();

  if (
    !emailField.classList.contains("invalid") &&
    !passField.classList.contains("invalid")
  ) {
    alert("Login successful! Redirecting to chatbot...");
    window.location.href = "law.html"; // Redirect to chatbot screen
  }
});
