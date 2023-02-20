const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text) => {
  const videoCommnents = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");

  const icon = document.createElement("i");
  icon.className = "fa-regular fa-comment";

  const span = document.createElement("span");
  span.innerText = text;

  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.className = "video__comment";

  videoCommnents.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();

  const textarea = form.querySelector("textarea");

  const videoId = videoContainer.dataset.id;
  const text = textarea.value;

  if (text === "") {
    return;
  }

  const { status } = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (status === 201) {
    addComment(text);
  }

  textarea.value = "";
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
