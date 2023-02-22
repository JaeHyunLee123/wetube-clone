const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtnArr = document.querySelectorAll(".deleteBtn");

const handleDeleteBtn = async (event) => {
  const parent = event.target.parentElement;
  const commentId = parent.dataset.id;
  const videoId = videoContainer.dataset.id;

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ commentId }),
  });

  if (response.status === 200) {
    parent.classList.add("hide");
  }
};

const addComment = (text, newCommentId) => {
  const videoCommnents = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");

  const icon = document.createElement("i");
  icon.className = "fa-regular fa-comment";

  const span = document.createElement("span");
  span.innerText = text;

  const Xbtn = document.createElement("span");
  Xbtn.innerText = "❌";
  Xbtn.className = "deleteBtn";
  Xbtn.addEventListener("click", handleDeleteBtn);

  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(Xbtn);
  newComment.className = "video__comment";
  newComment.dataset.id = newCommentId;

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

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (response.status === 201) {
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
    textarea.value = "";
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
if (deleteBtnArr) {
  deleteBtnArr.forEach((btn) => btn.addEventListener("click", handleDeleteBtn));
}
