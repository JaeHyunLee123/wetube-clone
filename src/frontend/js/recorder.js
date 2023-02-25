const recordBtn = document.getElementById("recordBtn");
const preview = document.getElementById("preview");

let stream = null;

const handleStart = () => {
  recordBtn.innerText = "Stop recording";
  recordBtn.removeEventListener("click", handleStart);
  recordBtn.addEventListener("click", handleStop);

  const recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    //Can get video from event.data
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 5000);
};

const handleStop = () => {
  recordBtn.innerText = "Start recoring";
  recordBtn.removeEventListener("click", handleStop);
  recordBtn.addEventListener("click", handleStart);
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 600 },
  });
  preview.srcObject = stream;
  preview.play();
};

init();

recordBtn.addEventListener("click", handleStart);
