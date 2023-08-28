import Post from "../models/Posts.js";
import User from "../models/User.js";

/* CREATE */

export const createPost = async(req, res) => {
    try {
        const {userId, description, picturePath} = req.body;
        const user = await User.findById(userId);
        const newPost = new Post ({
            userId, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            location: user.location, 
            description, 
            userPicturePath: user.picturePath, 
            picturePath, 
            likes: {
                //empty first, 
                //going to look like this;
                // "someid": true (if not listed, they haven't liked it)
            }, 
            comments: []

        });

        await newPost.save();
        //saving the post

        //grabbing all the posts
        const post = await Post.find();

        //201 represents created something ; 200 is a successful request
        res.status(201).json(post);


    } catch(err) {
        res.status(409).json({message: err.message});
    }
};

/* READ */

export const getFeedPosts = async (req, res) => {
    try {
        //grabbing all the posts
        const post = await Post.find();
        res.status(200).json(post);

    } catch (err) {
        res.status(404).json({message: err.message});
    }
};

export const getUserPosts = async (req, res) => {

    try {
        const { userId } = req.params;
        //will only match the posts with his user id and return those
        const post = await Post.find({userId});
        res.status(200).json(post);
    } catch {
        res.status(404).json({message: err.message});
    }

};

/* UPDATE */

export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);

        //we are going to check if it exists - which means that user has liked the post
        //like key-value pair : userid-booleanvalue
    
        const isLiked = post.likes.get(userId);

        if(isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        //1. we are updating the likes of the post
        //2. we are updating the post object by sending the new likes field
        const updatedPost = await Post.findByIdAndUpdate(
            id, 
            {likes: post.likes}, 

            // we just want a new object
            {new: true}
        );

        //sending to frontend
        res.status(200).json(updatedPost);
    } catch {
        res.status(404).json({message: err.message});
    }
}

