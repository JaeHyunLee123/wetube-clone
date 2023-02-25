const recordBtn = document.getElementById("recordBtn");
const preview = document.getElementById("preview");

let stream = null;
let recorder = null;

const handleStart = () => {
  recordBtn.innerText = "Stop recording";
  recordBtn.removeEventListener("click", handleStart);
  recordBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    //Can get video from event.data
    const videoFile = URL.createObjectURL(event.data);
    //Set preview's source to recorded video
    preview.srcObject = null;
    preview.src = videoFile;
    //Show recorded video
    preview.loop = true;
    preview.play();
  };
  recorder.start();
};

const handleStop = () => {
  recordBtn.innerText = "Start recoring";
  recordBtn.removeEventListener("click", handleStop);
  recordBtn.addEventListener("click", handleStart);

  recorder.stop();
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
