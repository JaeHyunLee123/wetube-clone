let videos = [
  {
    title: "First",
    raiting: 5,
    comments: 2,
    createdAt: "1 hours ago",
    views: 1110,
    id: 0,
  },
  {
    title: "Second",
    raiting: 5,
    comments: 2,
    createdAt: "1 hours ago",
    views: 59,
    id: 1,
  },
  {
    title: "Third",
    raiting: 5,
    comments: 2,
    createdAt: "1 hours ago",
    views: 59,
    id: 2,
  },
];

export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos });
};

export const search = (req, res) => res.send("search");

export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id];
  return res.render("watch", {
    pageTitle: `Watching: ${video.title}`,
    video,
  });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id];
  return res.render("edit", {
    pageTitle: `Editing: ${video.title} video`,
    video,
  });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id].title = title;
  return res.redirect(`/videos/${id}`);
};

export const deleteVideo = (req, res) => res.send("Delete video");

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
  // her we will add a video a video to the videos array
  const newVideo = {
    title: req.body.title,
    raiting: 0,
    comments: 0,
    createdAt: "1 minute ago",
    views: 0,
    id: videos.length,
  };

  videos.push(newVideo);

  return res.redirect("/");
};
