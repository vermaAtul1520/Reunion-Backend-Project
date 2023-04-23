const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    name: {
      type: String,
    },
    password: {
      type: String,
    },
    followers: [
      {
        followerId: {
          type: String,
        },
        followerName: {
          type: String,
        },
      },
    ],
    followings: [
      {
        followingId: {
          type: String,
        },
        followingName: {
          type: String,
        },
      },
    ],
    // messages: [
    //   {
    //     messagerId: {
    //       type: String
    //     },
    //     messagerName: {
    //       type: String
    //     },
    //     messagerAvatar: {
    //       type: String
    //     },
    //     pitchId: {
    //       type: String
    //     },
    //     date: {
    //       type: Date,
    //       default: Date.now
    //     }
    //   }
    // ]
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
