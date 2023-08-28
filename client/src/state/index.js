import { create } from "@mui/material/styles/createTransitions";
import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";

//will be stored in our global state
// this data will be accessible throughout our entire application
const initialState = {
    mode: "light", //going to represent light or dark mode
    user: null, 
    token: null,
    posts: [],
};

export const authSlice = createSlice ({
    name: "auth", 
    initialState, 

    //Reducer: Fuctions involved in modyfying state
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";     
        }, 
        //action.payload - params argument for the function
        //here MIGHT be sending an object in the parameters of the function
        setLogin: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        }, 

        setLogout: (state) => {
            state.user = null;
            state.token = null
        }, 

        setFriends: (state, action) => {
            //If user already exists 
            if(state.user) {
                state.user.friends = action.payload.friends;
            } else {
                console.error("user friends non existent");
            }
        }, 
        setPosts: (state, action) => {
            state.posts = action.payload.posts;
        }, 

        //DOUBT
        // we will go thorugh list of posts
        //if we find the post we just updated - we will replace it with the updated post passed in parameter
        //otherwise we return original posts if we did not find it
        setPost: (state, action) => {
            const updatedPosts = state.posts.map((post) => {

                //using post id passed in parameter to find the relevant post and return it
                if(post._id === action.payload.post._id) return action.payload.post;
                return post;

            });

            state.posts = updatedPosts;


        }


    }
})

export const {setMode, setLogin, setLogout, setFriends, setPosts, setPost} = authSlice.actions;
export default authSlice.reducer;