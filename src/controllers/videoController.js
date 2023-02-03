import Video from "../models/Video";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({});
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.send("server-error");
  }
};

export const search = (req, res) => res.send("search");

export const watch = (req, res) => {
  const { id } = req.params;

  return res.render("watch");
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id];
  return res.render("edit", {
    pageTitle: `Editingvideo`,
    video,
  });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};

export const deleteVideo = (req, res) => res.send("Delete video");

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title, //same with title : title
      description, //same with description : description
      hashtags: hashtags
        .split(",")
        .map((word) =>
          !word.trim().startsWith("#") ? `#${word.trim()}` : word.trim()
        ),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};
