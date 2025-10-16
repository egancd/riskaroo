// Wait for the page to load before running anything
document.addEventListener("DOMContentLoaded", () => {

  // === Load the shared header ===
  const headerContainer = document.getElementById("header-placeholder");

  if (headerContainer) {
    fetch("header.html")
      .then(response => response.text())
      .then(data => {
        headerContainer.innerHTML = data;
      })
      .catch(error => console.error("Error loading header:", error));
  }



  // === Example: log which page you’re on ===
  console.log("Page loaded:", window.location.pathname);
});
