const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");


// Use big letter first to indicate that this is an object based on a blueprint
// Import mongodb post schema

const app = express();

mongoose.connect("mongodb://postsdbapp:iDcCQndWwPPh@localhost:27017/postsdb?retryWrites=true")
  .then(() => {
    console.log('Connected to database!')

  })
  .catch(() => {
    console.log('Connection failed!')
  })

app.use(bodyParser.json());

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



module.exports = app;
