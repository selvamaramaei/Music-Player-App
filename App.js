const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#controls #prev");
const play = document.querySelector("#controls #play");
const next = document.querySelector("#controls #next");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressBar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const ul = document.querySelector(".list-group");

const player = new MusicPlayer(musicList);

window.addEventListener("load", () => {
  let music = player.getMusic();
  displayMusic(music);
  displayMusicList(player.musicList);
  isPlayingNow();
});

function displayMusic(music) {
  title.innerText = music.getName();
  singer.innerText = music.singer;
  image.src = "img/" + music.img;
  audio.src = "Mp3/" + music.file;
}

play.addEventListener("click", () => {
  // is playing class contains in containers div?
  const isMusicPlay = container.classList.contains("playing");
  // If isMusicPlay is true, it calls the pauseMusic() function.
  // If isMusicPlay is false, it calls the playMusic() function
  isMusicPlay ? puaseMusic() : playMusic();
});

prev.addEventListener("click", () => {
  prevMusic();
});

next.addEventListener("click", () => {
  nextMusic();
});

function puaseMusic() {
  container.classList.remove("playing");
  play.querySelector("i").classList = "fa-solid fa-play";
  audio.pause();
}

function playMusic() {
  container.classList.add("playing");
  play.querySelector("i").classList = "fa-solid fa-pause";
  audio.play();
}

function prevMusic() {
  player.prev();
  let music = player.getMusic();
  displayMusic(music);
  playMusic();
  isPlayingNow();
}

function nextMusic() {
  player.next();
  let music = player.getMusic();
  displayMusic(music);
  playMusic();
  isPlayingNow();
}

const calculateTime = (totalSeconds) => {
  const minute = Math.floor(totalSeconds / 60);
  const second = Math.floor(totalSeconds % 60);
  const updatedSecond = second < 10 ? `0${second}` : `${second}`;
  const sonuc = `${minute}:${updatedSecond}`;
  return sonuc;
};

//loadedmetadata : event is fired when the browser has loaded the metadata for an audio or video element. Metadata includes information like the duration of the media, its dimensions
audio.addEventListener("loadedmetadata", () => {
  duration.textContent = calculateTime(audio.duration);
  progressBar.max = Math.floor(audio.duration);
});

//The "timeupdate" event is fired when the current playback position of the audio changes, typically triggered as the audio plays
audio.addEventListener("timeupdate", () => {
  progressBar.value = Math.floor(audio.currentTime);
  currentTime.textContent = calculateTime(progressBar.value);
});

//the "input" event is triggered when the user interacts with the slider, dragging it or clicking on different positions.
progressBar.addEventListener("input", () => {
  currentTime.textContent = calculateTime(progressBar.value);
  audio.currentTime = progressBar.value;
});

let muteState = "unmuted";

volumeBar.addEventListener("input", (e) => {
  const value = e.target.value;
  // to convert the volume level from range of 0 to 100 to range of 0 to 1 which the volume property expects.
  audio.volume = value / 100;
  if (value == 0) {
    audio.muted = true;
    muteState = "muted";
    volume.classList = "fa-solid fa-volume-xmark";
  } else {
    audio.muted = false;
    muteState = "unmuted";
    volume.classList = "fa-solid fa-volume-high";
  }
});

volume.addEventListener("click", () => {
  // if its unmuted then make it muted
  if (muteState === "unmuted") {
    audio.muted = true;
    muteState = "muted";
    volume.classList = "fa-solid fa-volume-xmark";
    volumeBar.value = 0;
  } else {
    audio.muted = false;
    muteState = "unmuted";
    volume.classList = "fa-solid fa-volume-high";
    volumeBar.value = 100;
  }
});

function displayMusicList(list) {
  let liTags = "";
  for (let i = 0; i < list.length; i++) {
    liTags = `<li li-index='${i}' onclick="selectedMusic(this)"
      class="list-group-item d-flex justify-content-between align-items-center"
      >
      <span>${list[i].getName()}</span>
      <span id="music-${i}" class="badge bg-primary rounded-pill"></span> 
      <audio class="music-${i}" src="Mp3/${list[i].file}"></audio>
      </li>`;

    ul.insertAdjacentHTML("beforeend", liTags);

    let liAudioDuration = ul.querySelector(`#music-${i}`);
    let liAudioTag = ul.querySelector(`.music-${i}`);

    liAudioTag.addEventListener("loadeddata", () => {
      liAudioDuration.innerText = calculateTime(liAudioTag.duration);
    });
  }
}

function selectedMusic(li) {
  const index = li.getAttribute("li-index");
  player.index = index;
  displayMusic(player.getMusic());
  playMusic();
  isPlayingNow();
}

// by adding playing class we change the background color of the music in list
function isPlayingNow() {
  for (let li of ul.querySelectorAll("li")) {
    if (li.classList.contains("playing")) {
      li.classList.remove("playing");
    }
    if (li.getAttribute("li-index") == player.index) {
      li.classList.add("playing");
    }
  }
}

// if music ends go to the other one
audio.addEventListener("ended", () => {
  nextMusic();
});
