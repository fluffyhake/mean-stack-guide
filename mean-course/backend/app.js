const path = require('path');
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user")


// Use big letter first to indicate that this is an object based on a blueprint
// Import mongodb post schema

const app = express();

mongoose.connect("mongodb://postsdbapp:" + process.env.MONGO_PWD + "@localhost:27017/postsdb?retryWrites=true")
  .then(() => {
    console.log('Connected to database!')

  })
  .catch(() => {
    console.log('Connection failed!')
  })

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
// The static middleware will be allowed to continue:
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});



// only paths starting with /api/posts will be forwarded to posts Routes
app.use("/api/posts", postsRoutes)


// Forward to user signup
app.use("/api/user", userRoutes)


module.exports = app;
