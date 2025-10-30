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

async function loadGames() {
  const res = await fetch("https://sports-betting-backend.onrender.com/api/games");
  const games = await res.json();

  const list = document.getElementById("games-list");
  list.innerHTML = "";

  games.slice(0, 10).forEach(game => {
    const li = document.createElement("li");
    li.textContent = `${game.home_team} vs ${game.away_team} (${game.start_date})`;
    list.appendChild(li);
  });
}
