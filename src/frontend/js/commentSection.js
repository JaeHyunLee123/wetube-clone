const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");

const handleSubmit = (event) => {
  event.preventDefault();
  const video = videoContainer.dataset.id;
  const text = textarea.value;
};

form.addEventListener("submit", handleSubmit);
