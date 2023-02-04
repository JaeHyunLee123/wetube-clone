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
});

videoSchema.pre("save", async function () {
  this.hashtags = this.hashtags[0] //유저가 입력한 hashtags가 통째로 배열의 첫번째 원소에 저장되기 때문에 hashtags[0]을 쓰는거임
    .split(",")
    .map((word) =>
      !word.trim().startsWith("#") ? `#${word.trim()}` : word.trim()
    );
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
