const express = require("express");
const Post = require("../models/post");
const router = new express.Router();
const auth = require("../middleware/auth");
const cors = require("cors");

router.use(
  cors({
    origin: "*",
  })
);

router.post("/api/posts", auth, async (req, res) => {
  const post = new Post({
    postTitle: req.body.title,
    postDescription: req.body.description,
  });

  post.userId = req.user._id;
  post.userName = req.user.name;
  // post.likes=[];
  // post.comments=[];

  try {
    await post.save();
    const postData = {
      postId: post._id,
      title: post.postTitle,
      description: post.postDescription,
      // createdOn:post.createdOn
    };
    res.status(201).send(postData);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/api/posts/:id", auth, async (req, res) => {
  await Post.findByIdAndDelete({ _id: req.params.id }, (err, response) => {
    if (err) res.status(500).send(err);
  })
    .clone()
    .catch(function (err) {
      console.log(err);
    });

  res.status(200).send("Post deleted successfully!");
});

router.post("/api/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    post.likes.push({ likerId: req.user._id });
    await post.save();
    res.status(200).send(true);
  } catch (e) {
    res.status(500).send(e);
  }
});
router.post("/api/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    const updatedLikes = post.likes.filter((like) => {
      return like.likerId != req.user._id;
    });
    post.likes = updatedLikes;
    await post.save();
    res.status(200).send(true);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/api/comment/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });

    const comment = {
      userID: req.user._id,
      name: req.user.name,
      commentText: req.body.comment,
      date: Date.now(),
    };
    post.comments.push(comment);
    await post.save();
    const commentData = post.comments.find((comment) => {
      return (
        comment.commentText == req.body.comment &&
        comment.userID == req.user._id
      );
    });
    res.status(200).send(commentData._id);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/api/posts/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    const tempObj = { ...post._doc };
    // If you wanna want number only
    tempObj.likes = post.likes.length;
    await delete tempObj.userId;
    await delete tempObj.userName;
    res.status(200).send(tempObj);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/api/all_posts", auth, async (req, res) => {
  try {
    const posts = await Post.find({ _id: req.user_id }).sort({
      createdAt: "asc",
    });
    const finalPosts = posts.map((post) => {
      const temp = {
        id: post._id,
        title: post.postTitle,
        desc: post.postDescription,
        createdAt: post.createdAt,
        comments: post.comments,
        likes: post.likes.length,
      };
      return temp;
    });

    res.status(200).send(finalPosts);
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
