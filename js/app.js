"use strict";

/* ==========================
   INDEX (splash screen)
   ========================== */
if (document.querySelector(".splash-screen")) {
  document.addEventListener("DOMContentLoaded", () => {
    const logo = document.querySelector(".logo");
    const splash = document.querySelector(".splash-screen");

    // Logo-animation
    setTimeout(() => logo.classList.add("animate"), 800);

    // Fade ud efter 2.5 sekunder
    setTimeout(() => splash.classList.add("fade-out"), 2500);

    // Skift til location.html efter 3.5 sekunder
    setTimeout(() => {
      window.location.href = "sites/location.html";
    }, 3500);
  });
}

/* ==========================
   LOCATION (fade in)
   ========================== */

if (document.querySelector(".location")) {
  document.addEventListener("DOMContentLoaded", () => {
    const locationSection = document.querySelector(".location");

    // Fade ind
    setTimeout(() => locationSection.classList.add("fade-in"), 100);
  });
}

/* ==========================
   SPILGALLERI (navbar, dialog osv.)
   ========================== */

if (document.querySelector(".spilgalleri-titel")) {
  console.log("🎮 Spilgalleri loaded");
}

// Back button (sikker måde)
const backBtn = document.querySelector(".back-btn");
if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "../sites/location.html";
  });
}

// søg
const searchInput = document.getElementById("search");
if (searchInput) {
  searchInput.addEventListener("input", () => displayGames(allGames)); // Adjust as needed
}

let allGames = [];

// #2: Fetch games from JSON file
async function getGames() {
  const response = await fetch("../data/games.json");
  allGames = await response.json();
  console.log("📁 Games loaded:", allGames.length);
  // populateCategoryDropdown(); // Remove or comment out if not implemented
  displayGames(allGames);
}

// #3: Display all games
function displayGames(games) {
  const gameList = document.querySelector(".game-list-all");
  if (!gameList) return;
  gameList.innerHTML = "";

  if (games.length === 0) {
    gameList.innerHTML =
      '<p class="no-results">Ingen spil matchede dine filtre 😢</p>';
    return;
  }

  for (const game of games) {
    displayGame(game);
  }
}

// #4: Render a single game card and add event listeners
function displayGame(game) {
  const gameList = document.querySelector(".game-list-all");
  if (!gameList) return;

  const gameHTML = `
    <article class="game-card" tabindex="0" data-id="${game.id}">
        <section class="top-card">
            <img src="${game.image}" 
            alt="${game.title}" 
            class="game-image" />
            <div class="age-tag">${game.age}</div>
            <div class="rating-tag">${game.rating}</div>
            <div class="difficulty-tag">${game.difficulty}</div>
        </section>
        <section class="bottom-card">
            <h2 class="card-titel">${game.title}</h2>
            <div class="tags">
                <p>${game.genre}</p>
            </div>
            <div class="tags">
                <p>${game.playtime}</p>
            </div>
            <div class="tags">
                <p>${game.players.min}-${game.players.max}</p>
            </div>
            <div class="tags">
                <p>${game.language}</p>
            </div>
        </section>
    </article>
  `;
  gameList.insertAdjacentHTML("beforeend", gameHTML);

  // Tilføj click event til den nye card
  const newCard = gameList.lastElementChild;
  newCard.addEventListener("click", function () {
    showGameModal(game.id);
  });
}

// #6: Vis game details (Session 3 version - bliver erstattet med modal i Del 2)
function showGameDetails(game) {
  alert(`
🎬 ${games.title} (${game.year})

🎭 Genre: ${games.genre.join(", ")}
⭐ Rating: ${games.rating}
🎥 Director: ${games.director}
👥 Actors: ${games.actors.join(", ")}

📝 ${games.description}
  `);
}

//Game Card Dialog
function getDifficultyClass(difficulty) {
  switch (difficulty.toLowerCase()) {
    case "let":
      return "difficulty-easy";
    case "mellem":
      return "difficulty-medium";
    case "svær":
      return "difficulty-hard";
    default:
      return "";
  }
}

function showGameModal(id) {
  const game = allGames.find((g) => g.id == id);
  if (!game) return;

  document.querySelector("#dialog-content").innerHTML = /*html*/ `

    <img src="${game.image}" alt="${game.title}" class="game-image" />
    <div class="dialog-details">
      <h2>${game.title}</h2>

      <div class="dialog-tags">
      <p class="game-category">${game.genre}</p>
      <p class="game-rating">☆ ${game.rating}</p>
      <p class="difficulty-tag ${getDifficultyClass(game.difficulty)}">${
    game.difficulty
  }</p>
      </div>
      <p>${game.playtime} min</p>
      <p>${game.players.min}-${game.players.max}</p>
      <p>${game.age}+</p>
      <p></strong> ${game.difficulty}</p>
      <p>${game.language}</p>
      <p><${game.location}, hylde ${game.shelf}</p>
      <p class="game-description">${game.rules}</p>
    </div> 
  
  `;

  document.querySelector("#game-dialog").showModal();
}

// Luk dialog på klik af X
document.querySelector("#close-dialog").addEventListener("click", () => {
  document.querySelector("#game-dialog").close();
});

// Dropdown-menu //// Åbn/luk dropdowns

// Load games on page load
document.addEventListener("DOMContentLoaded", getGames);

// FILTRERINGSSYSTEM //

// værdier fra input felter
function filterGames() {
  const searchValue = document
    .querySelector("#search-input")
    .value.toLowerCase();
  const difficultyValue = document.querySelector("#difficulty-select").value;
  const ageValue = document.querySelector("#age-select").value;
  const genreValue = document.querySelector("#genre-select").value;
  const playtimeValue = document.querySelector("#playtime-select").value;

  // Start med alle spil - kopieres efterfølgende
  let filteredGames = allGames;

  // filtrer på spil titel
  if (searchValue) {
    // Kun filtrer hvis der er indtastet noget
    filteredGames = filteredGames.filter((game) => {
      // includes() checker om søgeteksten findes i titlen
      return game.title.toLowerCase().includes(searchValue);
    });
  }

  // filtrer på valgt sværhedsgrad
  if (difficultyValue !== "all") {
    // Kun filtrer hvis ikke "all" er valgt
    filteredGames = filteredGames.filter((game) => {
      // Eksakt match på sværhedsgrad
      return game.difficulty === difficultyValue;
    });
  }

  // FILTER 3: Alder - filtrer på aldersgrænse
  if (ageValue !== "all") {
    // Kun filtrer hvis ikke "all" er valgt
    const filterAge = Number(ageValue) || 0;
    filteredGames = filteredGames.filter((game) => {
      // Check om spillets alder er mindre eller lig filterens alder
      return game.age <= filterAge;
    });
  }

  // filtrer på valgt genre
  if (genreValue !== "all") {
    // Kun filtrer hvis ikke "all" er valgt
    filteredGames = filteredGames.filter((game) => {
      // Eksakt match på genre
      return game.genre === genreValue;
    });
  }

  // Spilletid - filtrer på spilletid
  if (playtimeValue !== "all") {
    // Kun filtrer hvis ikke "all" er valgt
    const filterTime = Number(playtimeValue) || 0;
    filteredGames = filteredGames.filter((game) => {
      // Check om spillets spilletid er større eller lig filterens tid
      return game.playtime >= filterTime;
    });
  }

  // Vis de filtrerede spil på siden
  displayGames(filteredGames);
}

// Event listeners til alle filtre
document.addEventListener("DOMContentLoaded", () => {
  getGames();

  // Event listener til søgning
  document
    .querySelector("#search-input")
    .addEventListener("input", filterGames);

  // Event listeners til alle filter-dropdowns
  document
    .querySelector("#difficulty-select")
    .addEventListener("change", filterGames);
  document.querySelector("#age-select").addEventListener("change", filterGames);
  document
    .querySelector("#genre-select")
    .addEventListener("change", filterGames);
  document
    .querySelector("#playtime-select")
    .addEventListener("change", filterGames);
});

//Vestergade spilgalleri
function showVestergadeGames() {
  if (!allGames || allGames.length === 0) {
    return getGames().then(() => {
      showVestergadeGames();
      const filtered = allGames.filter(
        (g) => g.location && g.location.toLowerCase().trim() === "verstergade"
      );
      displayGames(filtered);
      return filtered;
    });
  }

  const filtered = allGames.filter(
    (g) => g.location && g.location.toLowerCase().trim() === "verstergade"
  );
  displayGames(filtered);
  return Promise.resolve(filtered);
}
