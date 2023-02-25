const recordBtn = document.getElementById("recordBtn");
const preview = document.getElementById("preview");

const handleStart = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 600 },
  });
  preview.srcObject = stream;
  preview.play();
};

recordBtn.addEventListener("click", handleStart);
