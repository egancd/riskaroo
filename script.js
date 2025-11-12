const BACKEND_URL = "https://sports-betting-backend-vkc2.onrender.com";

/**
 * Fetches the game data from your backend.
 * This is your reusable function.
 * @returns {Promise<Array|null>} The game data array, or null if an error occurs.
*/
async function fetchGameData(weekNumber) {
  try {
    const response = await fetch(BACKEND_URL + `/api/games?week=${weekNumber}`);
    
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

let balance = 100;
let current_bet = 0;
let teamBet = "Colorado";

function betOutcome() {
  const container = document.getElementById("outcome");
  if (container) {
    container.textContent = "Congrats! You bet on the winning team! Don't gamble. You won: " + Math.trunc(current_bet * 2.3) + " tokens";
  }
  setBalance(balance + current_bet * 2.3);
}

function getBalance() {
  const container = document.getElementById("balance");
  if (container) {
    // Use .textContent for performance and security when inserting text
    container.textContent = String(balance);
  }
}

function setBalance(number) {
  const container = document.getElementById("balance");
  if (container) {
    container.textContent = String(number);
  }
  balance = number;
}


function placeBet() {
  const inputElement = document.getElementById('bet-amount');
  const resultElement = document.getElementById('result');
  
  // 2. Get the bet amount and convert it to a number
  const betAmount = Number(inputElement.value);

  // 3. Add validation
  if (isNaN(betAmount) || betAmount <= 0) {
    resultElement.textContent = "Please enter a valid bet amount.";
    resultElement.style.color = "red";
    return; // Stop the function
  }

  if (betAmount > balance) {
    resultElement.textContent = "You don't have enough tokens for that bet.";
    resultElement.style.color = "red";
    return; // Stop the function
  }

  // 4. Update the balance variable
  balance = balance - betAmount;

  // 5. CRITICAL: Call getBalance() to update the display
  getBalance();

  // 6. Give the user feedback
  resultElement.textContent = `Bet of ${betAmount} tokens placed. Good luck!`;
  resultElement.style.color = "green";

  current_bet = betAmount;

  // Optional: Clear the input field after a successful bet
  inputElement.value = "";
}

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

  

  getBalance();

  const betForm = document.getElementById("bet-form");
  if (betForm) {
    betForm.addEventListener("submit", (event) => {
      // 9. IMPORTANT: Stop the form from reloading the page
      console.log("Bitch");
      event.preventDefault();
      
      // 10. Call your placeBet function
      placeBet();
    });
  }
  
  
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

      //const weekInput = document.getElementById("week-input");
      //const weekNumber = weekInput.value;

      statusElement.textContent = `Loading game...`;
      container.innerHTML = "";
      loadButton.disabled = true; // Disable button while loading

      const allGameData = await fetchGameData(1);

      if (allGameData) {
        statusElement.textContent = "Game loaded!";
        
        const gameListHtml = formatGamesAsList(allGameData);
        
        container.innerHTML = gameListHtml;

      } else {
        statusElement.textContent = "Failed to load data. Please try again.";
      }
      
      loadButton.disabled = false;

      betOutcome();
    });

  }

  // Add more if(loadData) functions for more kinds of calls,
  // and replace fetchGameData() with the desired function call.
  // Leave formatGamesAsList the same and just edit that function for better formatting

});