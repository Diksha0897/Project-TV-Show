//You can edit ALL of the code here
function setup() {
  const allEpisodes = getAllEpisodes();
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("numberOfEpisodes");
  rootElem.textContent = `Got ${episodeList.length} episode(s)`;
}
console.log(getOneEpisode());

let array = getAllEpisodes();

for (let i = 0; i < array.length - 1; i++) {
  let item = document.querySelector(".container");
  //let linkTag = document.querySelector(".link");
  let clone = item.cloneNode(true);
  //let clone2 = linkTag.cloneNode(true);
  document.getElementById("root").appendChild(clone);
  //document.getElementById("root").appendChild(clone2);
}

for (let i = 0; i < array.length; i++) {
  let episodeName = array[i].name;
  let seasonNumber = array[i].season.toString().padStart(2, 0);

  let episodeNumber = array[i].number.toString().padStart(2, 0);

  let imageEpisode = array[i].image.medium;

  let linkEpisode = array[i]._links.self.href;
  let episodeSummary = array[i].summary;

  document.getElementsByClassName("episodename")[i].textContent =
    `${episodeName} - S${seasonNumber}E${episodeNumber}`;
  document.getElementsByClassName("summary")[i].innerHTML = `${episodeSummary}`;
  document.getElementsByClassName("png")[i].src = `${imageEpisode}`;
  document.getElementsByClassName("link")[i].href = `${linkEpisode}`;
}

window.onload = setup;
