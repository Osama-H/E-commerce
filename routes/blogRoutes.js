const express = require("express");
const router = express.Router();

const authController = require("./../controllers/authController");
// const blogController = require("./../controllers/blogController");

// router
//   .route("/")
//   .post(
//     authController.protect,
//     authController.restrictTo("admin"),
//     blogController.createBlog
//   )
//   .get(blogController.getBlogs);

// router.route("/:id").patch(blogController.updateBlog).get(blogController.getBlog) 

// router.route('/:blogId/like').post(authController.protect,blogController.likeBlog)
// router.route('/:blogId/dislike').post(authController.protect,blogController.dislikeBlog)


// module.exports = router;
