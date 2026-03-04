//You can edit ALL of the code here

// ================== GLOBAL VARS ==================

let episodesAndShowsContainer = document.getElementById("container");
let searchBox = document.getElementById("searchBar");
let dropdownMenuEpisodes = document.getElementById("dropdownEpisode");
let dropdownMenuShow = document.getElementById("dropdownShow");

let allEpisodes = [];
let allShows = [];

function pad(number) {
  return number.toString().padStart(2, "0");
}

function createEpisodeCode(season, number) {
  return `S${pad(season)}E${pad(number)}`;
}

//fetch shows

async function fetchShows() {
  let response = await fetch("https://api.tvmaze.com/shows");

  allShows = await response.json();

  displayShow(allShows);

  setupDropdownForShow();
}

//fetch episodes

async function fetchEpisodes(showId) {
  episodesAndShowsContainer.innerHTML = "<p>Loading episodes...</p>";

  if (localStorage.getItem(showId)) {
    allEpisodes = JSON.parse(localStorage.getItem(showId));

    displayEpisodes(allEpisodes);
    searchEpisodes();
    setupDropdownForEpisodes();
    backButton();
  } else {
    try {
      let response = await fetch(
        `https://api.tvmaze.com/shows/${showId}/episodes`,
      );

      allEpisodes = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      localStorage.setItem(showId.toString(), JSON.stringify(allEpisodes));

      displayEpisodes(allEpisodes);

      searchEpisodes();

      setupDropdownForEpisodes();
      backButton();

      return allEpisodes;
    } catch (error) {
      episodesAndShowsContainer.innerHTML =
        "<p style='color:red;'>Error loading episodes. Please try again later.</p>";
    }
  }
}

function backButton() {
  let backToShow = document.createElement("button");
  backToShow.classList.add("backtoshow");
  backToShow.textContent = "Back to shows";
  document.querySelector("#searchMenu").append(backToShow);
  backToShow.addEventListener("click", () => {
    dropdownMenuShow.hidden = false;
    dropdownMenuShow.value = "";
    dropdownMenuEpisodes.hidden = true;
    displayShow(allShows);
    backToShow.remove();
  });
}

//load selection

window.onload = async function () {
  fetchShows();
};

// ================= DISPLAY =================

function displayShow(allShows) {
  episodesAndShowsContainer.innerHTML = "";

  allShows.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase().toLowerCase()),
  );

  allShows.forEach((show) => {
    let showCard = document.createElement("div");

    showCard.className = "show-card";

    showCard.innerHTML = ` <div class="show-header">
          <h2>${show.name}</h2>
        </div>
        <img src="${show.image.medium}" alt="${show.name}"></img>
        <p> ${show.summary} </p> 
        <p class ="showDetails"> <strong> Genres: </strong> ${show.genres} </p> 
        <p class ="showDetails"> <strong> Current Status: </strong> ${show.status} </p> 
         <p class ="showDetails"> <strong> Show Rating: </strong> ${show.rating.average} </p> 
          <p class ="showDetails"> <strong> Runtime: </strong> ${show.runtime} min </p> `;

    episodesAndShowsContainer.appendChild(showCard);
  });
}

function displayEpisodes(episodeList) {
  episodesAndShowsContainer.innerHTML = "";

  episodeList.forEach((episode) => {
    const card = document.createElement("div");
    card.className = "episode-card";

    const episodeCode = createEpisodeCode(episode.season, episode.number);
    card.id = episodeCode;

    card.innerHTML = `
      <div class="episode-header">
        <h2>${episodeCode} - ${episode.name}</h2>
      </div>
      <img src="${episode.image.medium}" alt="${episode.name}">
      ${episode.summary}
    `;

    episodesAndShowsContainer.appendChild(card);
  });

  document.getElementById("numberOfEpisodes").textContent =
    `Displaying ${episodeList.length}/${allEpisodes.length} episodes`;
}

// ================= SEARCH =================

function searchEpisodes() {
  searchBox.addEventListener("input", () => {
    const searchValue = searchBox.value.toLowerCase();

    const result = allEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchValue) ||
        episode.summary.toLowerCase().includes(searchValue),
    );

    displayEpisodes(result);
  });
}

// ================= EPISODE SELECTOR =================

function setupDropdownForEpisodes() {
  dropdownMenuEpisodes.innerHTML = `<option value="">Jump to episode...</option>`;

  allEpisodes.forEach((episode) => {
    const episodeCode = createEpisodeCode(episode.season, episode.number);

    const option = document.createElement("option");
    option.text = `${episodeCode} - ${episode.name}`;
    option.value = episodeCode;

    dropdownMenuEpisodes.add(option);
  });

  dropdownMenuEpisodes.addEventListener("change", (event) => {
    const selected = event.target.value;

    if (!selected) {
      displayEpisodes(allEpisodes);
      return;
    }

    const filtered = allEpisodes.filter(
      (ep) => createEpisodeCode(ep.season, ep.number) === selected,
    );

    displayEpisodes(filtered);
  });
}

function setupDropdownForShow() {
  if (dropdownMenuShow.hidden) {
    dropdownMenuShow.hidden = "false";
  }
  dropdownMenuShow.innerHTML = `<option value="">Jump to shows...</option>`;

  allShows.forEach((show) => {
    const option = document.createElement("option");
    option.text = ` ${show.name}`;
    option.value = show.id;

    dropdownMenuShow.add(option);
  });

  dropdownMenuShow.addEventListener("change", (event) => {
    const selectedShowId = event.target.value;

    if (!selectedShowId) {
      displayShow(allShows);
      dropdownMenuEpisodes.innerHTML = "";
      return;
    }
    dropdownMenuShow.hidden = true;
    dropdownMenuEpisodes.hidden = false;
    fetchEpisodes(selectedShowId);
  });
}
