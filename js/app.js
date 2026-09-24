"use strict";



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

  document.querySelector("#dialog-content").innerHTML = `
    <div class="dialog-topbar">
      <button type="button" class="dialog-close" aria-label="Luk spilinformation">× <span>Luk</span></button>
    </div>

    <div class="dialog-image-wrap">
      <img src="${game.image}" alt="${game.title}" class="dialog-game-image" />
    </div>

    <div class="dialog-details">
      <div class="dialog-title-row">
        <h2>${game.title}</h2>
        <span class="dialog-difficulty ${getDifficultyClass(game.difficulty)}">Sværhedsgrad: ${game.difficulty}</span>
      </div>
      <p class="dialog-summary">${game.genre} <span aria-hidden="true">·</span> <span class="dialog-star">★</span> Bedømmelse ${game.rating} ud af 5</p>

      <div class="dialog-shelf">
        <span class="dialog-shelf-pin" aria-hidden="true">⌖</span>
        <div><span>Find spillet her</span><strong>${game.location} · Hylde ${game.shelf}</strong></div>
      </div>

      <dl class="dialog-info-list">
        <div><dt>Spilletid</dt><dd>${game.playtime} min</dd></div>
        <div><dt>Spillere</dt><dd>${game.players.min}–${game.players.max} personer</dd></div>
        <div><dt>Alder</dt><dd>Fra ${game.age} år</dd></div>
        <div><dt>Sprog</dt><dd>${game.language}</dd></div>
      </dl>

      <details class="dialog-about">
        <summary>Om spillet <span aria-hidden="true">⌄</span></summary>
        <p>${game.rules}</p>
      </details>
    </div>
  `;

  const dialog = document.querySelector("#game-dialog");
  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.showModal();
}

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
  const playersValue = document.querySelector("#players-select").value;
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
if (playersValue !== "all") {
  const players = Number(playersValue);
  filteredGames = filteredGames.filter(
    (game) => game.players.min <= players && game.players.max >= players,
  );
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
    .querySelector("#players-select")
    .addEventListener("change", filterGames);
  document
    .querySelector("#playtime-select")
    .addEventListener("change", filterGames);
});
const filterBar = document.querySelector(".filter-bar");

if (filterBar) {
  const filterButton = document.createElement("button");

  filterButton.type = "button";
  filterButton.id = "filter-toggle";
  filterButton.textContent = "☷  Filtrér (4)";

  filterBar.prepend(filterButton);

  filterButton.addEventListener("click", () => {
    filterBar.classList.toggle("filters-open");
  });
}

document.querySelector("#reset-filters").addEventListener("click", () => {
  document.querySelector("#search-input").value = "";
  document.querySelector("#difficulty-select").value = "all";
  document.querySelector("#age-select").value = "all";
  document.querySelector("#genre-select").value = "all";
  document.querySelector("#players-select").value = "all";
  document.querySelector("#playtime-select").value = "all";

  displayGames(allGames);
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
