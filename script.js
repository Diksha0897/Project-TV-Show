//You can edit ALL of the code here
const allEpisodes = getAllEpisodes();

window.onload = function () {
  displayEpisodes(allEpisodes);
  setupSearch();
};

function displayEpisodes(episodeList) {
  const root = document.getElementById("root");
  root.innerHTML = "";

  episodeList.forEach(episode => {
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
    `Displaying ${episodeList.length}/${allEpisodes.length} episodes`;
}

function setupSearch() {
  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("input", function () {
    const value = searchInput.value.toLowerCase();

    const filtered = allEpisodes.filter(ep => {
      return (
        ep.name.toLowerCase().includes(value) ||
        ep.summary.toLowerCase().includes(value)
      );
    });

    displayEpisodes(filtered);
  });
}
