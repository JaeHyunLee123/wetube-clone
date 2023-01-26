export const trending = (req, res) => {
  const videos = [
    {
      title: "First",
      raiting: 5,
      comments: 2,
      createdAt: "1 hours ago",
      views: 59,
      id: 1,
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
      id: 1,
    },
  ];
  return res.render("home", { pageTitle: "Home", videos });
};
export const search = (req, res) => res.send("search");
export const watch = (req, res) =>
  res.render("watch", { pageTitle: "Watch", videoNumber: req.params });
export const edit = (req, res) => res.send("Edit video");
export const deleteVideo = (req, res) => res.send("Delete video");
export const upload = (req, res) => res.send("upload video");
