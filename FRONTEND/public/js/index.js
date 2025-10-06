// Typing animation
const typed = new Typed(".text", {
    strings: [
      "electronics for a greener future.",
      "gadgets and reduce waste.",
      "tech and save the planet.",
      "your e-waste for a cleaner world.",
    ],
    typeSpeed: 100,
    backSpeed: 100,
    backDelay: 1000,
    loop: true,
  });
  
  // Authentication functions
  let selectedUserType = "";
  const backendURL = "http://127.0.0.1:27017/sewa";
  
  async function registerUser() {
    const fullName = document.getElementById("full-name").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
  
    if (!email || !password || !fullName) {
      alert("Please fill in all details.");
      return;
    }
  
    try {
      const response = await fetch(`${backendURL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          userType: selectedUserType,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("Registration successful!");
        window.location.href = "index.html";
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      alert("Error connecting to server.");
      console.error(error);
    }
  }
  
  async function loginUser() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
  
    if (!email || !password) {
      alert("Please enter email and password.");
      return;
    }
  
    try {
      const response = await fetch(`${backendURL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        sessionStorage.setItem("userType", data.userType);
        redirectToDashboard();
      } else {
        alert(data.message || "Login failed.");
      }
    } catch (error) {
      alert("Error connecting to server.");
      console.error(error);
    }
  }
  
  function redirectToDashboard() {
    const userType = sessionStorage.getItem("userType");
    if (userType === "customer") {
      window.location.href = "dashboard.html";
    } else if (userType === "recycler") {
      window.location.href = "retailer_dashboard.html";
    } else {
      alert("Please log in first.");
      showLogin();
    }
  }
  
  function logoutUser() {
    sessionStorage.removeItem("userType");
    localStorage.removeItem("token");
    window.location.href = "index.html";
  }
  
  // Logout on browser close
  window.addEventListener("beforeunload", () => {
    sessionStorage.removeItem("userType");
  });
  