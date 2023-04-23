const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    userName: {
      type: String,
    },
    postTitle: {
      type: String,
    },
    postDescription: {
      type: String,
    },
    likes: [
      {
        likerId: {
          type: String,
        },
      },
    ],
    comments: [
      {
        userID: {
          type: String,
        },
        name: {
          type: String,
        },
        commentText: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("post", postSchema);
module.exports = Post;
