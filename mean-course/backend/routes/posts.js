const express = require("express");
const Post = require("../models/post")

const checkAuth = require("../middleware/check-auth")

const multer = require("multer");
const { create } = require("../models/post");

const router = express.Router()

const MIME_TYPE_MAP ={
  'image/png' : 'png',
  'image/jpeg' : 'jpg',
  'image/jpg' : 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid){
      error = null;
    }
    // Is relative to where the server.js file is stored
    cb(error, "backend/images");
  },
  filename: (req, file, cb) =>{
    const name = file.originalname.toLowerCase().split(' ').join('-')
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' +Date.now() + '.' +ext);

  }

});

router.post(
  "",
  checkAuth,
  multer({storage: storage}).single("image"),
  (req,res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url +"/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',

      post: {
        id: createdPost._id,
        title: createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath,
        creator: createdPost.creator
      }
  });
  console.log(post);

  })
  .catch(error => {
    res.status(500).json({
      message: "Creating a post failed!"
    })
  })
});


// First paramater spcifies the uri
router.get('', (req, res, next) => {
  // Retrieve query from uri
  console.log(req.query)
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage){
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }

  // https://mongoosejs.com/docs/queries.html
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      return Post.count();
      })
      .then(count => {
        res.status(200).json({
          message: 'Posts fetched successfully!',
          posts: fetchedPosts,
          maxPosts: count
      })

      })
      .catch(error => {
        res.status(500).json({
          message: "Fetching posts failed!"
        });
    })
;
});

router.put("/:id",
// Note: We don't need to call the function with the parameters. Express will take care of that for you :) and pass along the request data
  checkAuth,
  multer({storage: storage}).single("image"),
  (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url +"/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  console.log(post);
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then(result =>{
    console.log(result)
    if (result.modifiedCount > 0) {
      res.status(200).json({ message : "Update sucsessful!"})
    } else {
      res.status(401).json({ message : "Unauthorized!"})
    }

  })
  .catch(error => {
    res.status(500).json({
      message: "Couldn't update post!"
    })
  })
});

router.get("/:id", (req, res, next) => {

  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    }else {
      res.status(404).json({message: "Post not found!"});
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching post failed!"
    })
  });
})

// ALLOW Paths with ID-s after posts when deleting:
router.delete("/:id", checkAuth, (req, res, next) =>{

  console.log(req.params.id);
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result => {
    console.log("Logging the result: ")
    console.log(result);
    if (result.deletedCount > 0) {
      res.status(200).json({ message : "Delete sucsessful!"})
    } else {
      res.status(401).json({ message : "Unauthorized!"})
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "Fetching posts failed!"
    })
  })
});


module.exports = router;
