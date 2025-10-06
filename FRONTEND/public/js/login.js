document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = this.email.value.trim();
    const password = this.password.value.trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5500/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      // ✅ Check if response is empty
      const text = await response.text();
      if (!text) {
        throw new Error("Empty response from server.");
      }

      // ✅ Parse response safely
      const data = JSON.parse(text);

      if (!response.ok) {
        console.error("Server Response Error:", data);
        throw new Error(data.message || "Login failed. Please try again.");
      }

      console.log("Login successful:", data);

     // ✅ Store JWT token and user details
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId); // stores userId separately
      localStorage.setItem("customer", JSON.stringify(data.customer)); // ✅ Add this line here


      alert(data.message || "Login successful!");

      // ✅ Redirect based on user type
      if (data.userType === "customer") {
        window.location.href = "../views/dashboard.html";
      } else if (data.userType === "recycler") {
        window.location.href = "../views/retailer_dashboard.html";
      } else {
        alert("Unknown user type. Contact support.");
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      alert(error.message);
    }
  });

