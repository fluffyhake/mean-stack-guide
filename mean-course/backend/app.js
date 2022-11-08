const express = require('express');
const bodyParser = require("body-parser");

const app = express();

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
  const post = req.body
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  })
});


// First paramater spcifies the uri
app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'jadajada',
      title: 'First server-side post',
      content: 'This is coming from the server'
    },
    {
      id: 'jadsdfgsdfgsdajada',
      title: 'Second server-side post',
      content: 'This is coming from the server'
    },
  ];
  // Responds with 200 OK
  res.status(200).json({
    message: 'Posts fetched successfully!',
    posts: posts
  });
});


module.exports = app;
