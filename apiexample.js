
let apiURL = 'https://api.tvmaze.com/';
let epURL = 'https://api.tvmaze.com/episodes/';


window.onload = function() {
  closeLightBox(); 
  document.getElementById("button").onclick = function () {
    searchTvShows();
  };
  document.getElementById("lightbox").onclick = function () {
    closeLightBox();
  };
} 


async function searchTvShows() {
  document.getElementById("main").innerHTML = "";
  let search = document.getElementById("search").value;

  try {
    const response = await fetch(apiURL + 'search/shows?q=' + search);
    const data = await response.json();
    console.log(data);
    showSearchResults(data);
  } catch(error) {
    console.error('Error fetching tv show:', error);
  } 
} 


function showSearchResults(data) {
 
  for (let tvshow in data) {
    createTVShow(data[tvshow]);
  } 
} 

function showGenres(genres) {
  let output = " ";

  for (g in genres) {
    output += " " + genres[g] + " ";
  } 
  output += "";
  return output;
} 
function createTVShow(tvshowJSON) {
  var elemMain = document.getElementById("main");
  elemMain.classList.add("main")
  var elemDiv = document.createElement("div");
  elemDiv.classList.add("main")
  var elemImage = document.createElement("img");
  elemImage.classList.add("img")

  var elemShowTitle = document.createElement("h2");
  elemShowTitle.classList.add("title");

  var elemGenre = document.createElement("div");
  elemGenre.classList.add("genre");
  
  var elemRating = document.createElement("div");
  elemRating.classList.add("rating");

  var elemSummary = document.createElement("div");
  elemSummary.classList.add("summary");


  elemImage.src = tvshowJSON.show.image ? tvshowJSON.show.image.medium
: 'https://via.placeholder.com/210x295?text=No+Image';
  elemShowTitle.innerHTML = tvshowJSON.show.name;
  elemGenre.innerHTML = "Genres:  " + showGenres(tvshowJSON.show.genres);
  elemRating.innerHTML = "Rating: " + (tvshowJSON.show.rating.average
|| 'No rating available');
  elemSummary.innerHTML = tvshowJSON.show.summary || 'No summary available.';

  elemDiv.appendChild(elemShowTitle);
  elemDiv.appendChild(elemGenre);
  elemDiv.appendChild(elemRating);
  elemDiv.appendChild(elemSummary);
  elemDiv.appendChild(elemImage);

  let showId = tvshowJSON.show.id;
  fetchEpisodes(showId, elemDiv);

  elemMain.appendChild(elemDiv);
}

async function fetchEpisodes(showId, elemDiv) {
  console.log("fetching episodes for showId: " + showId);

  try {
    const response = await fetch(apiURL + 'shows/' + showId + '/episodes');
    const data = await response.json();
    console.log("episodes");
    console.log(data);
    showEpisodes(data, elemDiv);
  } catch(error) {
    console.error('Error fetching episodes:', error);
  } 
} 

function showEpisodes (data, elemDiv) {
  let elemEpisodes = document.createElement("div");  
  let output = "<ol>";

  for (episode in data) {
    output += `<li class="qwe"><a href='javascript:showLightBox(` +
data[episode].id + `)'>` + data[episode].name + `</a></li>`;
  }
  output += "</ol>";
  elemEpisodes.innerHTML = output;
  elemDiv.appendChild(elemEpisodes);
} 
function showLightBox(episodeId){
  document.getElementById("lightbox").style.display = "block";

  epInfo(episodeId);
} 


function closeLightBox(){
  document.getElementById("lightbox").style.display = "none";
} 

async function epInfo(id) {
  try {
      const response = await fetch(epURL + id);
      const data = await response.json();

      const lightboxContent = `
          <img src="${data.image ? data.image.medium :
'https://via.placeholder.com/210x295?text=No+Image'}"
alt="${data.name}">
          <h2>${data.name}</h2>
          <p>Season: ${data.season}, Episode: ${data.number}</p>
          <p>${data.summary || 'No description available.'}</p>
      `;
      document.getElementById("message").innerHTML = lightboxContent;
  } catch (error) {
      console.error('Error fetching episode info:', error);
      document.getElementById("message").innerHTML = "<p>Error trying to fetch episode info</p>";
  }
} // epInfo


// load the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      console.log('Service Worker registered with scope:', registration.scope);

    }, function(error) {
      console.log('Service Worker registration failed:', error);
    });
  });
}         