import express, { Router } from "express";
import {
    getUser, 
    getUserFriends, 
    addRemoveFriend,
} from "../controllers/users.js";

import { verifyToken } from "../middleware/auth.js";

const router = express.Router();


/*READ */

//:id is a query string to grab the id

//will get the user in 
router.get("/:id", verifyToken, getUser);

//will grab the user friends
router.get("/:id/friends", verifyToken, getUserFriends);

/*UPDATE*/

//friendId of who we want to update - add or remove
router.patch("/:id/:friendId", verifyToken , addRemoveFriend);

export default router;