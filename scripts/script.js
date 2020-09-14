const APIkey = "o9178n6cmiiCDKLzwBKYwbC4zlbPgWYW";
const APIendpoint = "https://api.giphy.com/v1/gifs/";

let sailorDay = "styles/sailor_day.css";
let sailorNight = "styles/sailor_night.css";

//CAMBIO DE TEMA

function ver() {
  document.getElementById("theme-list").style.display = "block";
}

function ocultar() {
  document.getElementById("theme-list").style.display = "none";
}

function selectSailorNight() {
  document.getElementById("theme").href = sailorNight;
  document.getElementById("img-header").src = "img/gifOF_logo_dark.png";
  document.getElementById("lens").src = "img/lens.svg";
  setTheme();
}

function selectSailorDay() {
  document.getElementById("theme").href = sailorDay;
  document.getElementById("img-header").src = "img/gifOF_logo.png";
  setTheme();
}

function setTheme() {
  theme = document.getElementById("theme").getAttribute("href");
  if (theme == sailorDay) {
    localStorage.setItem("theme", 1);
  } else {
    localStorage.setItem("theme", 2);
  }
}
setTheme();

//MANTENER TEMA EN LOCALSTORAGE

if (localStorage.getItem("theme") == 2) {
  document.getElementById("theme").href = "styles/sailor_night.css";
  document.getElementById("img-header").src = "img/gifOF_logo_dark.png";
  document.getElementById("lens").src = "img/lens.svg";
}

//BÚSQUEDA

function getSearchResults() {
  document.querySelector(".search-results").style.display = "block";
  search = document.getElementById("search").value;
  const found = fetch(`${APIendpoint}search?q=${search}&api_key=${APIkey}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      document.querySelector(".autocomplete-search").style.display = "none";
      innerGifs = document.getElementById("researched_gifs");
      innerGifs.innerHTML = "";
      for (var i = 0; i < 16; i++) {
        gifID = data.data[i].id;
        imgURL = data.data[i].images.original.url;
        gifDiv = document.createElement("div");
        gifDiv.className = "gif";
        innerGifs.appendChild(gifDiv);
        imgChild = document.createElement("img");
        imgChild.className = "img-gif";
        imgChild.src = imgURL;
        titleDiv = document.createElement("div");
        titleDiv.className = "title-gif";
        titleDiv.id = `gif-${i + 1}`;

        gifDiv.append(imgChild, titleDiv);

        titulo_gif = data.data[i].title.trim().split(" ");
        titulo_gif = titulo_gif.filter((del) => del !== "GIF");
        for (var j = 0; j <= 2; j++) {
          if (titulo_gif[j] !== undefined && titulo_gif[j] !== "") {
            spanChild = document.createElement("span");
            spanChild.innerHTML = `#${titulo_gif[j]}`;
            document.getElementById(`gif-${i + 1}`).appendChild(spanChild);
          }
        }
        document.getElementById("results").innerText =
          "Resultados de búsqueda: " + search;
      }
    })
    .catch((error) => {
      return error;
    });
  return found;
}

//COMENZAR BÚSQUEDA CON TECLA ENTER

document.querySelector(".search-bar input").addEventListener("keydown", (e) => {
  if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
    document.querySelector(".btn-search").click();
    return false;
  } else {
    return true;
  }
});

//SUGERENCIAS DE BÚSQUEDA

function searchResult() {
  autoComp = document.querySelector(".autocomplete-search");
  autoComp.style.display = "block";
  search = document.getElementById("search").value;
  if (search === "") {
    autoComp.style.display = "none";
  }
  fetch(`${APIendpoint}search?q=${search}&api_key=${APIkey}&limit=3`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      autoComp.innerHTML = "";
      for (let i = 0; i < data.data.length; i++) {
        imgTITLE = data.data[i].title;
        if (imgTITLE !== "") {
          imgURL = data.data[i].bitly_url;
          sug = document.createElement("p");
          autoComp.appendChild(sug);
          innerS = `<a onclick="getSearchResults()" target='_blank'>${imgTITLE}</a>`;
          sug.innerHTML = innerS;
        }
      }
    });
}

// LIMPIAR RESULTADOS

function clearResults() {
  document.getElementById("researched_gifs").innerHTML = "";
  document.querySelector(".search-results").style.display = "none";
  document.getElementById("search").placeholder =
    "Busca gifs, hashtags, temas, busca lo que quieras…";
}

// SUGERENCIAS

function suggestedGifs(gif) {
  fetch(`${APIendpoint}search?q=${gif}&api_key=${APIkey}&limit=1`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let gif_box = document.createElement("div");
      gif_box.className = "gif-box";
      gif_box.innerHTML = `
                <div class='gif-title'>
                    <span>#${gif}</span><span style='float: right;'><img src='img/button3.svg' /></span>
                </div>
                <div class='gif-img'>
                    <img src='${data.data[0].images.original.url}'>
                <span class='btn-gif'><a target='_blank' onclick="searchSuggestedGif('${gif}')">Ver más...</a></span>
                </div>
            `;
      document.getElementById("gif_suggested").append(gif_box);
    });
}

function searchSuggestedGif(searchText) {
  document.getElementById("search").value = searchText;
  getSearchResults();
}

let suggestedArray = ["Spice girls", "daria", "90s", "nickelodeon"];
let rand = function () {
  let suggestedArraynew = [];
  let compara =
    suggestedArray[Math.floor(Math.random() * suggestedArray.length)];
  while (suggestedArraynew.length < 4) {
    if (!suggestedArraynew.includes(compara)) {
      suggestedArraynew.push(compara);
    }
    compara = suggestedArray[Math.floor(Math.random() * suggestedArray.length)];
  }
  return suggestedArraynew;
};
data = rand();
if (document.body.clientWidth < 500) {
  window.onload = suggestedGifs(data[Math.floor(Math.random() * data.length)]);
} else {
  for (let i = 0; i < data.length; i++) {
    window.onload = suggestedGifs(data[i]);
  }
}

//TENDENCIAS

function trendings() {
  const found = fetch(
    "https://api.giphy.com/v1/gifs/trending" +
      "?api_key=" +
      APIkey +
      "&limit=25"
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      for (let i = 0; i < data.data.length; i++) {
        let height = data.data[i].images.original.height;
        let width = data.data[i].images.original.width;
        let squareCheck = width / height;
        let imgURL = data.data[i].images.original.url;
        let gifTrend = document.createElement("div");
        gifTrend.className = "gif";
        gifTrend.innerHTML = `<img class='img-gif' src='${imgURL}' /><div class='title-gif' id='trend-gif-${
          i + 1
        }'></div>`;
        document.getElementById("giftrending").appendChild(gifTrend);
        titulo_gif = data.data[i].title.trim().split(" ");
        titulo_gif = titulo_gif.filter((del) => del !== "GIF");
        for (var j = 0; j <= 3; j++) {
          if (titulo_gif[j] !== undefined && titulo_gif[j] !== "") {
            let spanTituloGif = document.createElement("span");
            spanTituloGif.innerHTML = `#${titulo_gif[j]}`;
            document
              .getElementById(`trend-gif-${i + 1}`)
              .appendChild(spanTituloGif);
          }
        }
        if (squareCheck > 1.3) {
          document
            .querySelector(".gif:last-child")
            .classList.add("double-span");
        }
      }
    });
  return found;
}
trendings();
