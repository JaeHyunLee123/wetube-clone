import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const recordBtn = document.getElementById("recordBtn");
const preview = document.getElementById("preview");

let stream = null;
let recorder = null;
let videoFile = null;

const handleDownload = async () => {
  //create a ffmpeg object and load
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  //make a file to convert
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));
  //this function run ffmpeg code that use in terminal
  //this fucntion convert recording.wemb to output.mp4 and encode 60 frames for a sec
  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");

  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyRecord.webm"; //filename.fileformat
  document.body.appendChild(a);
  a.click();
};

const handleStart = () => {
  recordBtn.innerText = "Stop recording";
  recordBtn.removeEventListener("click", handleStart);
  recordBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream);
  recorder.ondataavailable = (event) => {
    //Can get video from event.data
    videoFile = URL.createObjectURL(event.data);
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
  recordBtn.innerText = "Download recording";
  recordBtn.removeEventListener("click", handleStop);
  recordBtn.addEventListener("click", handleDownload);

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
