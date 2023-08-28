import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
// import { verify } from "jsonwebtoken";

const router = express.Router();

/* READ */

//will get all the posts to curate the home feed
router.get("/", verifyToken, getFeedPosts);

//want to grab only the relevan't user's posts only
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */

//for liking and unliking a post 
router.patch("/:id/like", verifyToken, likePost);

export default router;