import mongoose from "mongoose";

const postSchema = mongoose.Schema(
    {
        userId: {
            type: String, 
            required: true,
        },
        firstName: {
            type: String, 
            required: true,
        },
        lastName: {
            type: String, 
            required: true,
        },
        location: String, 
        description: String, 
        picturePath: String, 
        userPicturePath: String, 
        likes: {
            //typically an object but mongodb saves it as a map
            type: Map, 

            //we need to check if userId exists in this map, if it exists - value will be true always 
            // if we like it, add to this map and if we unkine it - we are going to remove this map
            //could have used an array of strings (userId) but map will be more efficient (O(n) vs O(1))
             of: Boolean, 
        }, 
        comments: {
            type: Array, 
            default: [], 
        }
    }, {timestamps: true}
);

const Post = new mongoose.model("Post", postSchema);

export default Post;