let video = document.querySelector("#video");
let buffer = document.querySelectorAll(".buffer-bar-item");

//MANTENER TEMA EN LOCALSTORAGE

if (localStorage.getItem('theme') == 2) {
    document.getElementById("theme").href = 'styles/sailor_night.css';
    document.getElementById("img-header").src = "img/gifOF_logo_dark.png";
}

//TIMER

let timerVar = setInterval(countTimer, 1000);
let totalSeconds = 0;
let recording = false;

function countTimer() {
    if (recording) {
        totalSeconds++;
        let hour = Math.floor(totalSeconds / 3600);
        let minute = Math.floor((totalSeconds - hour * 3600) / 60);
        let seconds = totalSeconds - (hour * 3600 + minute * 60);
        if (hour < 10)
            hour = "0" + hour;
        if (minute < 10)
            minute = "0" + minute;
        if (seconds < 10)
            seconds = "0" + seconds;
        document.getElementById("timer").style.display = "block";
        document.getElementById("timer").innerHTML = hour + ":" + minute + ":" + seconds;
    }
}

//GRABAR GIF

function getStream() {
    document.querySelector(".create-gif-section").style.display = "none";
    document.querySelector(".video-recording").style.display = "block";
    const constraints = {
        video: true,
        audio: false
    };
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
            video.srcObject = stream;
        })
        .catch(error => {
            console.error(error);
        });
}

function startRecording() {
    recording = true;
    recorder = RecordRTC(video.srcObject, {
        type: "gif",
        frameRate: 0.5,
        quality: 10,
        width: 640,
        height: 480,

        onGifRecordingStarted: function () {
            console.log("started");
        }
    });

    countTimer();
    recorder.startRecording();

    document.getElementById("titleBox").innerHTML = "Capturando Tu Guifo";
    document.getElementById("startRecording").style.display = "none";
    document.querySelector(".stop").style.display = "block";
}


function stopRecording() {
    video.srcObject.getTracks().forEach(function (track) {
        track.stop();
    });
    recorder.stopRecording(function () {
        recording = false;
        video.style.display = "none";
        document.querySelector(".gif-preview-container").style.display = "block";
        document.querySelector('.gif-preview-container').innerHTML = `
        <img id="gif-preview" alt="vista previa del gif"></img>`
        preview = document.getElementById("gif-preview");
        preview.src = URL.createObjectURL(recorder.getBlob());
        document.getElementById("titleBox").innerHTML = "Vista Previa";

        let form = new FormData();
        form.append("file", recorder.getBlob(), "myGif.gif");

        document.getElementById("upload").addEventListener("click", () => {
            uploadGif(form);
        });
    });
    document.querySelector(".stop").style.display = "none";
    document.querySelector(".btns-upload-gif").style.display = "flex";
}

//SUBIR GIF

function uploadGif(gif) {
    document.getElementById("timer").style.display = "none";
    document.querySelector('.gif-preview-container').innerHTML = `
        <div class='uploading-gif'>
            <img src="img/globe_img.png">
            <p class='uploading-gif-title'>Estamos subiendo tu guifo...<p>
            <div class="progress-bar" id="progress-bar">
                <ul>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
            <p class='time-left'>Tiempo restante: <span style='text-decoration: line-through'>38 años</span> algunos segundos</p>
        </div>`;
    animateProgressBar();
    document.querySelector('.btns-upload-gif').innerHTML = `
        <button class="btn-create-gif repeat push" onclick="location.href='crearGifos.html'"><span>Cancelar</span></button>
        `

    fetch(
        "https://upload.giphy.com/v1/gifs?api_key=o9178n6cmiiCDKLzwBKYwbC4zlbPgWYW", {
        method: "POST",
        body: gif
    }
    )
        .then(response => {
            if (response.status === 200) {
                console.log('Gif subido con éxito');
                return response.json();
            } else {
                console.log('Error');
            }
        })
        .then(data => {
            console.log(data);
            fetch(
                `https://api.giphy.com/v1/gifs/${data.data.id}?&api_key=o9178n6cmiiCDKLzwBKYwbC4zlbPgWYW`
            )
                .then(response => {
                    return response.json();
                })
                .then(data => {
                    localStorage.setItem(
                        `mygif-${data.data.id}`,
                        JSON.stringify(data.data)
                    );
                    let alertGif = document.createElement('div');
                    alertGif.className = 'alert-gif';
                    alertGif.innerHTML = `
                        <p class='title-alert'> Guifo subido con éxito! <span style='float: right'>
                        <img id='closeAlert' src="img/close.svg"></span></p>
                        <div class='contentAlert'>
                            <img class='gif-alert' src='${data.data.images.original.url}'>
                        </div>
                        <div class='gif-alert-btns'>
                            <button id='copy_link'>Copiar Enlace Guifo</button>
                            <button id='download_gif'>Descargar Guifo</button>
                        </div>
                        `;
                    document.querySelector('.content').style.filter = 'grayscale(70%) blur(2px)';
                    document.querySelector('.header-title').style.filter = 'grayscale(70%) blur(2px)';
                    document.body.append(alertGif);
                    document.getElementById('closeAlert').addEventListener('click', () => {
                        document.querySelector('.alert-gif').style.display = 'none';
                        window.location.href = "crearGifos.html";
                    });
                    document.getElementById("copy_link").addEventListener("click", () => {
                        let url_newGif = URL.createObjectURL(recorder.getBlob());;
                        let texto = document.createElement("textarea");
                        texto.value = url_newGif;
                        document.body.appendChild(texto);
                        texto.select();
                        document.execCommand("copy");
                        document.body.removeChild(texto);
                        alert("El link de tu gif se ha copiado al portapapeles :)");
                    });
                    document.getElementById("download_gif").addEventListener("click", () => {
                        let url_newGif = URL.createObjectURL(recorder.getBlob());;
                        window.open(url_newGif, "_blank");
                    });
                });
        });
}

const myGifos = document.getElementById("mygifos");

(function displayGifs() {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).startsWith('mygif-')) {
            gifObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
            gif = document.createElement("img");
            gif.id = gifObj.id;
            gif.src = `${gifObj.images.original.url}`;
            gif.className = 'img-gif';
            myGifos.appendChild(gif);
        }
    }
})();

//BARRA DE PROGRESO

function animateProgressBar() {
    document.querySelector('.progress-bar').style.display = 'inline-block';
    let progressBar = document.getElementById('progress-bar');
    let liCounter = 0;
    setInterval(function () {
        progressBar.querySelectorAll('li')[liCounter].style.display = 'inline-block';
        if (liCounter >= 15) {
            progressBar.querySelectorAll('li').forEach(element => {
                element.style.display = 'none';
            })
            liCounter = 0;
        } else {
            liCounter++;
        }
    }, 400);
};
