import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, require: true, trim: true, maxLength: 80 },
  description: { type: String, require: true, trim: true, minLength: 20 },
  createdAt: { type: Date, require: true, default: Date.now }, //Date.now()가 아닌 것에 유의!
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, default: 0, require: true },
    rating: { type: Number, default: 0, require: true },
  },
  videoUrl: { type: String, require: true },
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
