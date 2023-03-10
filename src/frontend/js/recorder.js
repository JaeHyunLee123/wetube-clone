import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const recordBtn = document.getElementById("recordBtn");
const preview = document.getElementById("preview");
const loadingScreen = document.querySelector(".loading__screen");

let stream = null;
let recorder = null;
let videoFile = null;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, filename) => {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = filename; //filename.fileformat
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async () => {
  loadingScreen.classList.remove("hide");
  document.body.style.overflow = "hidden";
  recordBtn.removeEventListener("click", handleDownload);
  recordBtn.innerText = "Downloading...";
  recordBtn.disabled = true;

  //create a ffmpeg object and load
  const ffmpeg = createFFmpeg({ log: true });
  await ffmpeg.load();
  //make a file to convert
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  //this function run ffmpeg code that use in terminal
  //this fucntion convert recording.wemb to output.mp4 and encode 60 frames for a sec
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  //this function capture the video at the moment of "00:00:01"
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  );

  //this is raw data consists of unsigned integer array
  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumbFile = ffmpeg.FS("readFile", files.thumb);
  //this is real video and jpg
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecord.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  recordBtn.addEventListener("click", handleStart);
  recordBtn.innerText = "Record Again";
  recordBtn.disabled = false;
  loadingScreen.classList.add("hide");
  document.body.style.overflow = "auto";
};

const handleStart = () => {
  recordBtn.innerText = "Recording";
  recordBtn.removeEventListener("click", handleStart);
  recordBtn.disabled = true;

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

    recordBtn.innerText = "Download";
    recordBtn.disabled = false;
    recordBtn.addEventListener("click", handleDownload);
  };
  recorder.start();
  setTimeout(() => {
    recorder.stop();
  }, 5000);
};

const init = async () => {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 1024, height: 576 },
  });
  preview.srcObject = stream;
  preview.play();
};

init();

recordBtn.addEventListener("click", handleStart);
