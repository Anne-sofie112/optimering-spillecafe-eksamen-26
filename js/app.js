"use strict";

/* ==========================
   SPILGALLERI
   ========================== */

const backBtn = document.querySelector(".back-btn");
if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "../sites/location.html";
  });
}

let allGames = [];
const selectedLocation = new URLSearchParams(window.location.search).get(
  "location",
);

function getGamesForSelectedLocation() {
  if (!selectedLocation) return allGames;

  return allGames.filter(
    (game) =>
      game.location &&
      game.location.toLowerCase().trim() ===
        selectedLocation.toLowerCase().trim(),
  );
}

// #2: Fetch games from JSON file
async function getGames() {
  const response = await fetch("../data/games.json");
  allGames = await response.json();
  displayGames(getGamesForSelectedLocation());
}

// #3: Display all games
function displayGames(games) {
  const gameList = document.querySelector(".game-list-all");
  if (!gameList) return;

  const resultsCount = document.querySelector("#results-count");
  if (resultsCount) {
    const resultLabel = games.length === 1 ? "resultat" : "resultater";
    resultsCount.textContent = `${games.length} ${resultLabel}`;
  }

  gameList.innerHTML = "";

  if (games.length === 0) {
    gameList.innerHTML =
      '<p class="no-results">Ingen spil matchede dine filtre </p>';
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
    <button type="button" class="game-card" data-id="${game.id}">
      <div class="top-card">
            <img src="${game.image}" 
            alt="${game.title}" 
            class="game-image" />
            <div class="age-tag">Fra ${game.age} år</div>
            <div class="rating-tag">${game.rating}</div>
            <div class="difficulty-tag ${getDifficultyClass(game.difficulty)}">${game.difficulty}</div>
        </div>
        <div class="bottom-card">
            <h2 class="card-titel">${game.title}</h2>
            <div class="tags">
              <i data-lucide="shapes" aria-hidden="true"></i><p>Genre: ${game.genre}</p>
            </div>
            <div class="tags">
              <i data-lucide="clock-3" aria-hidden="true"></i><p>Spilletid: ${game.playtime} min.</p>
            </div>
            <div class="tags">
              <i data-lucide="users" aria-hidden="true"></i><p>Antal spillere: ${game.players.min}–${game.players.max} spillere</p>
            </div>
            <div class="tags">
              <i data-lucide="cake" aria-hidden="true"></i><p>Alder: Fra ${game.age} år</p>
            </div>
        </div>
      </button>
  `;
  gameList.insertAdjacentHTML("beforeend", gameHTML);

  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Tilføj click event til den nye card
  const newCard = gameList.lastElementChild;
  newCard.addEventListener("click", function () {
    showGameModal(game.id);
  });
}

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
          <div><dt><i data-lucide="clock-3" aria-hidden="true"></i>Spilletid</dt><dd>${game.playtime} min</dd></div>
          <div><dt><i data-lucide="users" aria-hidden="true"></i>Spillere</dt><dd>${game.players.min}–${game.players.max} personer</dd></div>
          <div><dt><i data-lucide="cake" aria-hidden="true"></i>Alder</dt><dd>Fra ${game.age} år</dd></div>
          <div><dt><i data-lucide="languages" aria-hidden="true"></i>Sprog</dt><dd>${game.language}</dd></div>
      </dl>

      <details class="dialog-about">
        <summary>Om spillet <span aria-hidden="true">⌄</span></summary>
        <p>${game.rules}</p>
      </details>
    </div>
  `;

  const dialog = document.querySelector("#game-dialog");
  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  if (window.lucide) {
    window.lucide.createIcons();
  }
  dialog.showModal();
}

function filterGames() {
  const searchValue = document
    .querySelector("#search-input")
    .value.toLowerCase();
  const difficultyValue = document.querySelector("#difficulty-select").value;
  const ageValue = document.querySelector("#age-select").value;
  const genreValue = document.querySelector("#genre-select").value;
  const playersValue = document.querySelector("#players-select").value;
  const playtimeValue = document.querySelector("#playtime-select").value;

  let filteredGames = getGamesForSelectedLocation();

  if (searchValue) {
    filteredGames = filteredGames.filter((game) => {
      return game.title.toLowerCase().includes(searchValue);
    });
  }

  if (difficultyValue !== "all") {
    filteredGames = filteredGames.filter((game) => {
      return game.difficulty === difficultyValue;
    });
  }

  if (ageValue !== "all") {
    const filterAge = Number(ageValue) || 0;
    filteredGames = filteredGames.filter((game) => {
      return game.age <= filterAge;
    });
  }

  if (genreValue !== "all") {
    filteredGames = filteredGames.filter((game) => {
      return game.genre === genreValue;
    });
  }
  if (playersValue !== "all") {
    const players = Number(playersValue);
    filteredGames = filteredGames.filter(
      (game) => game.players.min <= players && game.players.max >= players,
    );
  }

  if (playtimeValue !== "all") {
    const filterTime = Number(playtimeValue) || 0;
    filteredGames = filteredGames.filter((game) => {
      return game.playtime >= filterTime;
    });
  }

  displayGames(filteredGames);
}

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".page-gallery");
  if (!gallery) return;

  const filterBar = document.querySelector(".filter-bar");
  filterBar.id = "filter-controls";

  const filterButton = document.createElement("button");
  filterButton.type = "button";
  filterButton.id = "filter-toggle";
  filterButton.setAttribute("aria-expanded", "false");
  filterButton.setAttribute("aria-controls", "filter-controls");
  filterButton.innerHTML =
    '<i data-lucide="sliders-horizontal" aria-hidden="true"></i><span>Filtrér (5)</span>';
  filterBar.prepend(filterButton);

  filterButton.addEventListener("click", () => {
    filterBar.classList.toggle("filters-open");
    filterButton.setAttribute(
      "aria-expanded",
      String(filterBar.classList.contains("filters-open")),
    );
  });

  document.querySelector("#search-input").addEventListener("input", filterGames);
  document.querySelectorAll(".filter-bar select").forEach((select) => {
    select.addEventListener("change", filterGames);
  });

  document.querySelector("#reset-filters").addEventListener("click", () => {
    document.querySelector("#search-input").value = "";
    document.querySelectorAll(".filter-bar select").forEach((select) => {
      select.value = "all";
    });
    displayGames(getGamesForSelectedLocation());
  });

  if (window.lucide) window.lucide.createIcons();
  getGames();
});
