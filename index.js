const express = require("express");
const cors = require("cors");
require("./db/mongoose");
require("dotenv").config();

const postRouter = require("./routers/post");
const userRouter = require("./routers/user");

const app = express();

const port = 3000;

app.use(express.json());
app.use(postRouter);
app.use(userRouter);

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send({ msg: "Hey congratulations, we are connected" });
});

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
