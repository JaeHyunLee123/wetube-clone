import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  createdAt: { type: Date, require: true, default: Date.now }, //Date.now()가 아닌 것에 유의!
  hashtags: [{ type: String }],
  meta: {
    views: { type: Number, default: 0, require: true },
    rating: { type: Number, default: 0, require: true },
  },
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
