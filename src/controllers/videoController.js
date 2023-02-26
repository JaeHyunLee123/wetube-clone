import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comments";

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}).populate("owner");
    return res.render("home", { pageTitle: "Home", videos });
  } catch {
    return res.send("server-error");
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }

  return res.render("video/watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== req.session.user._id) {
    req.flash("error", "Not athorized");
    return res.status(403).redirect("/");
  }
  return res.render("video/edit", {
    pageTitle: `Edit "${video.title}"`,
    video,
  });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }

  if (String(video.owner) !== req.session.user._id) {
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("video/upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { videoFile, thumbFile } = req.files;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title, //same with title : title
      description, //same with description : description
      hashtags: Video.formatHashtags(hashtags),
      videoUrl: videoFile[0].path,
      thumbUrl: thumbFile[0].path,
      owner: _id,
    });

    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    await user.save();

    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("video/upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const userId = req.session.user._id;

  const video = await Video.findById(id);
  const user = await User.findById(userId);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found" });
  }
  if (String(video.owner) !== String(userId)) {
    return res.status(403).redirect("/");
  }

  await Video.findByIdAndDelete(id);
  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();

  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: { $regex: new RegExp(keyword, "i") },
    }).populate("owner");
  }
  return res.render("video/search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const targetVideo = await Video.findById(id);
    if (!targetVideo) {
      return res.sendStatus(404);
    }
    targetVideo.meta.views = targetVideo.meta.views + 1;
    await targetVideo.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const createComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;

  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }

  const owner = await User.findById(user._id);
  if (!owner) {
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });

  video.comments.push(comment._id);
  await video.save();

  owner.comments.push(comment._id);
  await owner.save();

  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const {
    params: { id }, //this id is video id
    session: { user },
    body: { commentId },
  } = req;

  console.log(id);
  console.log(user._id);
  console.log(commentId);

  try {
    const video = await Video.findById(id);
    if (!video) {
      return res.sendStatus(404);
    }

    const userFromDB = await User.findById(user._id);
    if (!userFromDB) {
      return res.sendStatus(404);
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.sendStatus(404);
    }

    //user.videos.splice(user.videos.indexOf(id), 1);
    video.comments.splice(video.comments.indexOf(commentId), 1);
    await video.save();

    userFromDB.comments.splice(userFromDB.comments.indexOf(commentId), 1);
    await userFromDB.save();

    await Comment.findByIdAndDelete(commentId);

    return res.sendStatus(200);
  } catch (error) {
    console.log(`Delete Comment Error: ${error}`);
    return res.sendStatus(400);
  }
};
