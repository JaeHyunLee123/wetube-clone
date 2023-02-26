import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, require: true, trim: true, maxLength: 80 },
  description: {
    type: String,
    require: true,
    trim: true,
    default: "No description",
  },
  createdAt: { type: Date, require: true, default: Date.now }, //Date.now()가 아닌 것에 유의!
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, require: true },
    rating: { type: Number, default: 0, require: true },
  },
  videoUrl: { type: String, require: true },
  thumbUrl: { type: String, require: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  owner: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "User" },
});

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) =>
      !word.trim().startsWith("#") ? `#${word.trim()}` : word.trim()
    );
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
