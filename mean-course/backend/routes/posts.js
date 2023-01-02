const express = require("express");

const PostController = require("../controllers/posts")


const checkAuth = require("../middleware/check-auth")
const extractFile = require("../middleware/file")


const { create } = require("../models/post");

const router = express.Router()



router.post(
  "",
  checkAuth,
  extractFile,
  PostController.createPosts
);

router.put("/:id",
// Note: We don't need to call the function with the parameters. Express will take care of that for you :) and pass along the request data
  checkAuth,
  extractFile,
  PostController.updatePost
);

// First paramater spcifies the uri
router.get('', PostController.getPosts);

router.get("/:id", PostController.getPost)

// ALLOW Paths with ID-s after posts when deleting:
router.delete("/:id", checkAuth, PostController.deletePost);


module.exports = router;
