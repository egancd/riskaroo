const BACKEND_URL = "https://sports-betting-backend-vkc2.onrender.com";

/**
 * Fetches the game data from your backend.
 * This is your reusable function.
 * @returns {Promise<Array|null>} The game data array, or null if an error occurs.
 */
async function fetchGameData() {
  try {
    const response = await fetch(BACKEND_URL + "/api/games");
    
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Add more async functions here to fetch different things, specifically with
// const response = await fetch(BACKEND_URL + "/api/games"); and
// const data = await response.json();
// Just change /api/games to whatever is in the backend under @app.route("/api/games")


function formatGamesAsList(gameData) {
  // Check if data is empty
  if (!gameData || gameData.length === 0) {
    return "<p>No games found for this week.</p>";
  }

  // Use .map() to loop over the data and create an HTML string for each game
  const gameItems = gameData.map(game => {
    // Access the data properties (e.g., game.home_team, game.home_points)
    // Adjust these keys based on your actual API response!
    return `
      <li>
        <strong>${game.homeTeam}</strong> vs <strong>${game.awayTeam}</strong>
        <br>
        Score: ${game.homePoints} - ${game.awayPoints}
      </li>
    `;
  });

  // Join all the list items together inside one <ul>
  return `<ul>${gameItems.join("")}</ul>`;
}

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
  
  console.log("Page loaded:", window.location.pathname);

  
  // Find your new HTML elements
  const loadButton = document.getElementById("load-games-button");
  const statusElement = document.getElementById("loading-status");
  const container = document.getElementById("games-list-container");

  // Add more buttons here, format in html with
  // <button id="placeholder">Button Title Here</button> then here add
  // const loadData = document.getElementById("placeholder");
  // Same with container to display the data


  if (loadButton) {
    
    loadButton.addEventListener("click", async () => {
      console.log("Button clicked!");

      statusElement.textContent = "Loading...";
      container.innerHTML = "";
      loadButton.disabled = true; // Disable button while loading

      const allGameData = await fetchGameData();

      if (allGameData) {
        // Success!
        statusElement.textContent = "Data loaded successfully!";
        
        const gameListHtml = formatGamesAsList(allGameData);
        
        container.innerHTML = gameListHtml;

      } else {
        statusElement.textContent = "Failed to load data. Please try again.";
      }
      
      loadButton.disabled = false;
    });
  }

  // Add more if(loadData) functions for more kinds of calls,
  // and replace fetchGameData() with the desired function call.
  // Leave formatGamesAsList the same and just edit that function for better formatting

});