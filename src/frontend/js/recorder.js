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
  //this function capture the video at the moment of "00:00:01"
  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    "thumbnail.jpg"
  );

  //this is raw data consists of unsigned integer array
  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");
  //this is real video and jpg
  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "MyRecord.mp4"; //filename.fileformat
  document.body.appendChild(a);
  a.click();

  const thumbA = document.createElement("a");
  thumbA.href = thumbUrl;
  thumbA.download = "MyThumbnail.jpg"; //filename.fileformat
  document.body.appendChild(thumbA);
  thumbA.click();

  ffmpeg.FS("unlink", "recording.webm");
  ffmpeg.FS("unlink", "output.mp4");
  ffmpeg.FS("unlink", "thumbnail.jpg");

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);
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
