//You can edit ALL of the code here
//cache
let showsCache = null;
let episodesCache = {};

//fetch shows

async function fetchShows() {
  if (showsCache) return showsCache;

  const response = await fetch("https://api.tvmaze.com/shows");

  if (!response.ok) {
    throw new Error("Failed to fetch shows");
  }

  const data = await response.json();

// Sort alphabetically (case insensitive)
  data.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  showsCache = data;
  return data;
}

//fetch episodes

async function fetchEpisodes(showId) {
  if (episodesCache[showId]) {
    return episodesCache[showId];
  }

  document.getElementById("root").textContent = "Loading episodes...";

  const response = await fetch(
    `https://api.tvmaze.com/shows/${showId}/episodes`
  );

  if (!response.ok) {
    document.getElementById("root").textContent = "Failed to load data";
    return [];
  }

  const data = await response.json();

  episodesCache[showId] = data; // cache episodes
  return data;
}

//load selection

window.onload = async function () {
  const showSelect = document.getElementById("Show-selector");

  try {
    const shows = await fetchShows();

    showSelect.innerHTML = '<option value="">Select Show</option>';

    shows.forEach((show) => {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      showSelect.appendChild(option);
    });

     //Display first show's episodes by default
    if (shows.length > 0) {
      const firstShowId = shows[0].id;
      showSelect.value = firstShowId; // select first show
      const episodes = await fetchEpisodes(firstShowId);
      displayEpisodes(episodes, episodes.length);
      setupSearch(episodes);
      setupSelector(episodes);
    }

    showSelect.addEventListener("change", async function () {
      const showId = this.value;
      if (!showId) return;

      const episodes = await fetchEpisodes(showId);

      displayEpisodes(episodes, episodes.length);
      setupSearch(episodes);
      setupSelector(episodes);

      document.getElementById("search-input").value = "";
    });
  } catch (error) {
    document.getElementById("root").textContent = "Failed to load shows";
  }
};

// ================= DISPLAY =================

function displayEpisodes(episodeList, totalLength) {
  const root = document.getElementById("root");
  root.innerHTML = "";

  episodeList.forEach((episode) => {
    const template = document.querySelector(".template");
    const clone = template.cloneNode(true);
    clone.classList.remove("template");

    const season = episode.season.toString().padStart(2, "0");
    const number = episode.number.toString().padStart(2, "0");

    clone.querySelector(".episodename").textContent =
      `${episode.name} - S${season}E${number}`;

    if (episode.image) {
      clone.querySelector(".png").src = episode.image.medium;
    }

    clone.querySelector(".summary").innerHTML =
      episode.summary || "No summary available.";


    root.appendChild(clone);
  });

  document.getElementById("numberOfEpisodes").textContent =
    `Displaying ${episodeList.length}/${totalLength} episodes`;
}

// ================= SEARCH =================

function setupSearch(allEpisodes) {
  const oldInput = document.getElementById("search-input");

// Remove old listener by cloning
  const newInput = oldInput.cloneNode(true);
  oldInput.parentNode.replaceChild(newInput, oldInput);

  newInput.addEventListener("input", function () {
    const value = this.value.toLowerCase();

    const filtered = allEpisodes.filter(
      (ep) =>
        ep.name.toLowerCase().includes(value) ||
        (ep.summary && ep.summary.toLowerCase().includes(value))
    );

    displayEpisodes(filtered, allEpisodes.length);

// Reset dropdown if searching
    document.getElementById("episode-select").value = "";
  });
}

// ================= EPISODE SELECTOR =================

function setupSelector(allEpisodes) {
  const oldSelect = document.getElementById("episode-select");

// Remove old listener by cloning
  const newSelect = oldSelect.cloneNode(false);
  oldSelect.parentNode.replaceChild(newSelect, oldSelect);

// Default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "All Episodes";
  newSelect.appendChild(defaultOption);

// Populate episodes
  allEpisodes.forEach((ep) => {
    const option = document.createElement("option");

    const season = ep.season.toString().padStart(2, "0");
    const number = ep.number.toString().padStart(2, "0");

    option.value = ep.id;
    option.textContent = `S${season}E${number} - ${ep.name}`;

    newSelect.appendChild(option);
  });

// When user selects episode
  newSelect.addEventListener("change", function () {
    const selectedId = this.value;

    if (!selectedId) {
      displayEpisodes(allEpisodes, allEpisodes.length);
      return;
    }

    const selectedEpisode = allEpisodes.filter(
      (ep) => ep.id == selectedId
    );

    displayEpisodes(selectedEpisode, allEpisodes.length);

// Clear search when dropdown is used
    document.getElementById("search-input").value = "";
  });
}
