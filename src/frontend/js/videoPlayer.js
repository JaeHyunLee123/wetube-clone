const videoContainer = document.getElementById("videoContainer");
const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenBtn = document.getElementById("fullScreen");
const fullSrceenIcon = fullScreenBtn.querySelector("i");
const videoControllers = document.getElementById("videoControllers");

let isfocusOnVideo = true;
let controlsTimeout = null;
let volume = 0.5;
video.volume = volume;

const handlePlayClick = (event) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused
    ? "fa-solid fa-play"
    : "fa-solid fa-pause";
};

const handleMute = () => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fa-solid fa-volume-xmark"
    : "fa-solid fa-volume-high";
  volumeRange.value = video.muted ? 0 : volume;
};

const handleVolumeChange = (event) => {
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volume = event.target.value;
  video.volume = event.target.value;
};

const formatTime = (seconds) => {
  if (seconds >= 3600 * 1000) {
    return new Date(seconds * 1000).toISOString().substring(11, 19);
  } else {
    return new Date(seconds * 1000).toISOString().substring(14, 19);
  }
};

const handleLoadedMetaData = (event) => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
};

const handelTimeUpdate = (event) => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (event) => {
  video.currentTime = event.target.value;
};

const changeVideoTime = (seconds) => {
  video.currentTime += seconds;
};

const handelFullScreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    fullSrceenIcon.classList = "fa-solid fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullSrceenIcon.classList = "fa-solid fa-compress";
  }
};

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  videoControllers.classList.add("showing");
  controlsTimeout = setTimeout(() => {
    videoControllers.classList.remove("showing");
  }, 1000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(() => {
    videoControllers.classList.remove("showing");
  }, 1000);
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, { method: "POST" });
};

const handleKeyUp = (event) => {
  if (isfocusOnVideo) {
    const { code } = event;

    if (code === "Space") {
      handlePlayClick();
    }
    if (code === "ArrowRight") {
      changeVideoTime(5);
    }
    if (code === "ArrowLeft") {
      changeVideoTime(-5);
    }
    if (code === "ArrowUp") {
      if (video.muted) handleMute();
      video.volume = video.volume + 0.1 > 1 ? 1 : video.volume + 0.1;
      volumeRange.value = video.volume;
    }
    if (code === "ArrowDown") {
      if (video.muted) handleMute();
      video.volume = video.volume - 0.1 < 0 ? 0 : video.volume - 0.1;
      volumeRange.value = video.volume;
    }
  }
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadeddata", handleLoadedMetaData);
video.addEventListener("timeupdate", handelTimeUpdate);
video.addEventListener("ended", handleEnded);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handelFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
video.addEventListener("click", handlePlayClick);
document.addEventListener("keyup", handleKeyUp);
document.addEventListener("click", (event) => {
  const { target } = event;

  if (target.closest("#videoContainer")) {
    isfocusOnVideo = true;
  } else {
    isfocusOnVideo = false;
  }
});
document.addEventListener("keydown", (event) => {
  if (isfocusOnVideo) {
    const { code } = event;
    if (
      code === "Space" ||
      code === "ArrowRight" ||
      code === "ArrowLeft" ||
      code === "ArrowUp" ||
      code === "ArrowDown"
    ) {
      event.preventDefault();
    }
  }
});
