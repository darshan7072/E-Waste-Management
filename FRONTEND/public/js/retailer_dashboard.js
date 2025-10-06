document.addEventListener("DOMContentLoaded", function () {
  const sidebarLinks = document.querySelectorAll(".sidebar ul li a");
  const mainContent = document.getElementById("main-content");
  const loading = document.getElementById("loading");

  function showLoading() {
    loading.style.display = "block";
  }

  function hideLoading() {
    loading.style.display = "none";
  }

  // Load content for the clicked page
  // function loadContent(url, pageName) {
  //   showLoading(); // Show loading spinner

  //   fetch(url) // Use fetch to load the content
  //     .then((response) => response.text()) // Get the HTML content as text
  //     .then((data) => {
  //       mainContent.innerHTML = data; // Insert the content into main
  //       hideLoading(); // Hide loading spinner
  //       window.history.pushState({ page: pageName }, pageName, `#${pageName}`); // Update the URL without reloading
  //     })
  //     .catch((error) => {
  //       mainContent.innerHTML = `<p>Error loading the page. Please try again.</p>`;
  //       hideLoading();
  //     });
  // }
  function loadContent(url, pageName) {
    showLoading();
  
    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        mainContent.innerHTML = html;
  
        // Extract and execute external & inline scripts
        const scripts = mainContent.querySelectorAll("script");
  
        scripts.forEach((oldScript) => {
          const newScript = document.createElement("script");
  
          if (oldScript.src) {
            newScript.src = oldScript.src;
            newScript.async = false;
          } else {
            newScript.textContent = oldScript.textContent;
          }
  
          document.body.appendChild(newScript);
          oldScript.remove();
        });
  
        hideLoading();
        window.history.pushState({ page: pageName }, pageName, `#${pageName}`);
      })
      .catch((err) => {
        mainContent.innerHTML = "<p>Failed to load content.</p>";
        hideLoading();
        console.error("Failed to load:", url, err);
      });
  }
  
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const href = this.getAttribute("href");
      const pageName = this.getAttribute("data-page");

      // Check if Logout is clicked
      if (pageName === "logout") {
        logoutUser();
        return;
      }

      sidebarLinks.forEach((link) => link.classList.remove("active"));
      this.classList.add("active");

      loadContent(href, pageName);
    });
  });

  // Handle back and forward browser navigation (when user uses the browser back/forward buttons)
  window.addEventListener("popstate", function (event) {
    if (event.state && event.state.page) {
      const pageName = event.state.page;
      const link = document.querySelector(
        `.sidebar a[data-page="${pageName}"]`
      );

      if (link) {
        sidebarLinks.forEach((link) => link.classList.remove("active"));
        link.classList.add("active");
        loadContent(link.getAttribute("href"), pageName);
      }
    }
  });

  // Handle initial page load based on hash in URL
  const initialPage = window.location.hash.substring(1) || "overview";
  const initialLink = document.querySelector(
    `.sidebar a[data-page="${initialPage}"]`
  );

  if (initialLink) {
    initialLink.classList.add("active");
    loadContent(initialLink.getAttribute("href"), initialPage);
  }
});

function logoutUser() {
  // Clear any stored user data, such as tokens
  localStorage.removeItem("authToken");
  localStorage.removeItem("userType");
  sessionStorage.clear(); // Clear any session data

  // Redirect to the homepage
  // Adjust the path to ensure it correctly points to index.html
  window.location.href = "../views/index.html";
}
