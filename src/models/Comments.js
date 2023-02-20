import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, require: true, default: Date.now },
  owner: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "User" },
  video: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "Video" },
});

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
