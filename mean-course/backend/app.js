const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Use big letter first to indicate that this is an object based on a blueprint
// Import mongodb post schema
const Post = require("./models/post")

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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept');

  res.setHeader('Access-Control-Allow-Methods',
                'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.post("/api/posts", (req,res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  })
});


// First paramater spcifies the uri
app.get('/api/posts', (req, res, next) => {
  // https://mongoosejs.com/docs/queries.html
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: documents
      });



    });
  // Responds with 200 OK

});


module.exports = app;
