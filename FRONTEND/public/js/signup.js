// Role selection handling
const roleButtons = document.querySelectorAll(".role-btn");
const userTypeInput = document.getElementById("userType");

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // Remove active class from all buttons
    roleButtons.forEach((btn) => btn.classList.remove("active"));
    // Add active class to clicked button
    button.classList.add("active");
    // Update hidden input value
    userTypeInput.value = button.dataset.role;
  });
});

// Form submission
document
  .getElementById("signup-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullName = this.fullName.value;
    const email = this.email.value;
    const password = this.password.value;
    const confirmPassword = this.confirmPassword.value;
    const userType = userTypeInput.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5500/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, password, userType }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        window.location.href = "login.html";
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });

function closeSignup() {
  window.location.href = "index.html"; // Redirect to the homepage or any other page
}
