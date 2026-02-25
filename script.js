//You can edit ALL of the code here

async function fetchEpisodes() {
  let response;
  try {
    document.getElementById("root").textContent = "Loading episodes...";
    response = await fetch("https://api.tvmaze.com/shows/82/episodes");
    if (!response.ok) {
      throw new Error("Failed to load data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    document.getElementById("root").textContent = "Failed to load Data";
  }
}

window.onload = async function () {
  const allEpisodes = await fetchEpisodes();
  console.log("Episodes:", allEpisodes);
  const length = allEpisodes.length;
  displayEpisodes(allEpisodes, length);
  setupSearch(allEpisodes);
  setupSelector(allEpisodes);
};

/* ================= DISPLAY ================= */

function displayEpisodes(episodeList, length) {
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

    clone.querySelector(".png").src = episode.image.medium;
    clone.querySelector(".summary").innerHTML = episode.summary;

    root.appendChild(clone);
  });

  document.getElementById("numberOfEpisodes").textContent =
    `Displaying ${episodeList.length}/${length} episodes`;
}

/* ================= SEARCH ================= */

function setupSearch(allEpisodes) {
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("input", function () {
    const value = searchInput.value.toLowerCase();

    const filtered = allEpisodes.filter(
      (ep) =>
        ep.name.toLowerCase().includes(value) ||
        ep.summary.toLowerCase().includes(value),
    );

    displayEpisodes(filtered, allEpisodes.length);

    // Reset dropdown if searching
    document.getElementById("episode-select").value = "";
  });
}

/* ================= SELECTOR ================= */

function setupSelector(allEpisodes) {
  const select = document.getElementById("episode-select");

  // Populate dropdown
  allEpisodes.forEach((ep) => {
    const option = document.createElement("option");

    const season = ep.season.toString().padStart(2, "0");
    const number = ep.number.toString().padStart(2, "0");

    option.value = ep.id;
    option.textContent = `S${season}E${number} - ${ep.name}`;

    select.appendChild(option);
  });

  // When user selects episode
  select.addEventListener("change", function () {
    const selectedId = this.value;

    if (!selectedId) {
      displayEpisodes(allEpisodes, allEpisodes.length);
      return;
    }

    const selectedEpisode = allEpisodes.filter((ep) => ep.id == selectedId);

    displayEpisodes(selectedEpisode, allEpisodes.length);

    // Clear search when dropdown is used
    document.getElementById("search-input").value = "";
  });
}
