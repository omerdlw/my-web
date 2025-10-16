import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  author: {
    type: String,
    required: [true, "Yorum yazarı zorunludur"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Yorum içeriği zorunludur"],
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const postSchema = new mongoose.Schema({
  TITLE: {
    type: String,
    required: [true, "Başlık zorunludur"],
    trim: true,
  },
  SLUG: {
    type: String,
    required: [true, "Slug zorunludur"],
    unique: true,
    trim: true,
  },
  CONTENT: {
    type: String,
    required: [true, "İçerik zorunludur"],
  },
  BANNER_BACKGROUND: {
    type: String,
    default: "",
  },
  BACKGROUND: {
    type: String,
    default: "",
  },
  CATEGORY: {
    type: String,
    required: [true, "Kategori zorunludur"],
    default: "",
  },
  TAGS: {
    type: [String],
    default: [],
  },
  AUTHOR: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, "Yazar zorunludur"],
  },
  CREATED_AT: {
    type: Date,
    default: Date.now,
  },
  UPDATED_AT: {
    type: Date,
    default: Date.now,
  },
  COMMENTS: {
    type: [commentSchema],
    default: [],
  },
  LIKES: {
    type: [String],
    default: [],
  },
});

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);

export default Post;
