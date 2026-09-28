"use strict";

/* ==========================
   SPILGALLERI
   ========================== */

let allGames = [];
let activeGameCard = null;
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

const iconPaths = {
  shapes:
    '<rect x="3" y="3" width="8" height="8" rx="1"/><circle cx="17" cy="7" r="4"/><path d="m13 21 4-7 4 7z"/>',
  "clock-3": '<circle cx="12" cy="12" r="10"/><path d="M12 6v6h4"/>',
  users:
    '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  cake: '<path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-2 4-2 4 2 4 2 1-2 4-2 4 2 4 2"/><path d="M2 21h20"/><path d="M7 8v2M12 8v2M17 8v2M7 4h.01M12 4h.01M17 4h.01"/>',
  languages:
    '<path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/>',
  "sliders-horizontal":
    '<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"/>',
};

function iconSvg(name) {
  return `<svg class="lucide lucide-${name}" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconPaths[name]}</svg>`;
}

// #4: Render a single game card and add event listeners
function displayGame(game) {
  const gameList = document.querySelector(".game-list-all");
  if (!gameList) return;

  const gameHTML = `
    <button type="button" class="game-card" data-id="${game.id}" aria-haspopup="dialog" aria-expanded="false" aria-controls="game-dialog">
      <div class="top-card">
            <img src="${game.image}"
            alt="${game.title}" 
              class="game-image"
              ${gameList.childElementCount === 0 ? 'fetchpriority="high"' : 'loading="lazy"'}
              width="760"
              height="760" />
            <div class="age-tag">Fra ${game.age} år</div>
            <div class="rating-tag">${game.rating}</div>
            <div class="difficulty-tag ${getDifficultyClass(game.difficulty)}">${game.difficulty}</div>
        </div>
        <div class="bottom-card">
            <h2 class="card-titel">${game.title}</h2>
            <div class="tags">
              ${iconSvg("shapes")}<p>Genre: ${game.genre}</p>
            </div>
            <div class="tags">
              ${iconSvg("clock-3")}<p>Spilletid: ${game.playtime} min.</p>
            </div>
            <div class="tags">
              ${iconSvg("users")}<p>Antal spillere: ${game.players.min}–${game.players.max} spillere</p>
            </div>
            <div class="tags">
              ${iconSvg("cake")}<p>Alder: Fra ${game.age} år</p>
            </div>
        </div>
      </button>
  `;
  gameList.insertAdjacentHTML("beforeend", gameHTML);

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

  activeGameCard = document.querySelector(`.game-card[data-id="${id}"]`);
  if (activeGameCard) {
    activeGameCard.setAttribute("aria-expanded", "true");
  }

  const dialog = document.querySelector("#game-dialog");
  dialog.setAttribute("aria-labelledby", `dialog-title-${game.id}`);

  document.querySelector("#dialog-content").innerHTML = `
    <div class="dialog-topbar">
      <button type="button" class="dialog-close" aria-label="Luk spilinformation">× <span>Luk</span></button>
    </div>

    <div class="dialog-image-wrap">
      <img
        src="${game.image}"
        alt="${game.title}"
        class="dialog-game-image"
      />
    </div>

    <div class="dialog-details">
      <div class="dialog-title-row">
        <h2 id="dialog-title-${game.id}">${game.title}</h2>
        <span class="dialog-difficulty ${getDifficultyClass(game.difficulty)}">Sværhedsgrad: ${game.difficulty}</span>
      </div>
      <p class="dialog-summary">${game.genre} <span aria-hidden="true">·</span> <span class="dialog-star">★</span> Bedømmelse ${game.rating} ud af 5</p>

      <div class="dialog-shelf">
        <span class="dialog-shelf-pin" aria-hidden="true">⌖</span>
        <div><span>Find spillet her</span><strong>${game.location} · Hylde ${game.shelf}</strong></div>
      </div>

      <dl class="dialog-info-list">
          <div><dt>${iconSvg("clock-3")}Spilletid</dt><dd>${game.playtime} min</dd></div>
          <div><dt>${iconSvg("users")}Spillere</dt><dd>${game.players.min}–${game.players.max} personer</dd></div>
          <div><dt>${iconSvg("cake")}Alder</dt><dd>Fra ${game.age} år</dd></div>
          <div><dt>${iconSvg("languages")}Sprog</dt><dd>${game.language}</dd></div>
      </dl>

      <details class="dialog-about">
        <summary>Om spillet <span aria-hidden="true">⌄</span></summary>
        <p>${game.rules}</p>
      </details>
    </div>
  `;

  dialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.showModal();
  dialog.querySelector(".dialog-close").focus();
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

  const dialog = document.querySelector("#game-dialog");
  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    dialog.close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dialog.open) {
      event.preventDefault();
      dialog.close();
    }
  });

  dialog.addEventListener("close", () => {
    if (!activeGameCard) return;
    activeGameCard.setAttribute("aria-expanded", "false");
    activeGameCard.focus();
    activeGameCard = null;
  });

  const filterBar = document.querySelector(".filter-bar");
  filterBar.id = "filter-controls";

  const filterButton = document.createElement("button");
  filterButton.type = "button";
  filterButton.id = "filter-toggle";
  filterButton.setAttribute("aria-expanded", "false");
  filterButton.setAttribute("aria-controls", "filter-controls");
  filterButton.innerHTML = `${iconSvg("sliders-horizontal")}<span>Filtrér (5)</span>`;
  filterBar.prepend(filterButton);

  filterButton.addEventListener("click", () => {
    filterBar.classList.toggle("filters-open");
    filterButton.setAttribute(
      "aria-expanded",
      String(filterBar.classList.contains("filters-open")),
    );
  });

  document
    .querySelector("#search-input")
    .addEventListener("input", filterGames);
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

  getGames();
});
