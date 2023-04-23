const express = require("express");
const User = require("../models/user");
const Post = require("../models/post");
const router = new express.Router();
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
router.use(
  cors({
    origin: "*",
  })
);

router.post("/api/users", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  try {
    await user.save();

    res.status(201).send("account created!");
  } catch (e) {
    res.status(500).send(e);
  }
});

router.post("/api/authenticate", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      throw new Error("User not Found!!");
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);

    if (!isMatch) {
      throw new Error("Password not matched please try again!");
    }
    // const token = generateAuthToken(req.body.email);
    const token = jwt.sign({ email: req.body.email }, process.env.JWT_SECRET);
    if (!token) return res.status(500).send("Not authenticated!");
    res.status(200).send(token);
  } catch (e) {
    res.status(500).send("Unable to login :" + e);
  }
});

router.post("/api/follow/:id", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }); //jisko maine follow kiya
    const me = req.user; //it's me
    const follow = {
      followerId: me._id,
      followerName: me.name,
    };

    const following = {
      followingId: user._id,
      followingName: user.name,
    };
    user.followers.push(follow);
    me.followings.push(following);
    await me.save();
    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/api/unfollow/:id", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }); //jisko maine follow kiya
    const me = req.user; //it's me
    const updatedFollowers = user.followers.filter((tempUser) => {
      return tempUser.followerId != me._id;
    });
    const updatedFollowing = me.followings.filter((tempUser) => {
      return tempUser.followingId != user._id;
    });
    me.followings = updatedFollowing;
    user.followers = updatedFollowers;
    await me.save();
    await user.save();
    res.status(201).send(me);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/api/user", auth, (req, res) => {
  const tempUser = {
    userName: req.user.name,
    // to get all followers and following details
    // followers: req.user.followers,
    // followings: req.user.followings,
    followers: req.user.followers.length,
    followings: req.user.followings.length,
  };
  res.status(200).send(tempUser);
});

module.exports = router;
