import { useEffect } from "react";
import { useSelector, useDispatch  } from "react-redux";
import PostWidget from "./PostWidget";
import { setPosts } from "state";

//Props is an object and we used like : props.image...
//Here we are destructurimg the object and using it
const PostsWidget = ({userId, isProfile = false}) => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts);
    const token = useSelector((state) => state.token);

    const getPosts = async () => {
        const response = await fetch("http://localhost:3001/posts", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        dispatch(setPosts({ posts: data }));
    };
    
    // const getPosts = async() => {
    //     const response = await fetch("http://localhost:3001/posts", {
    //         method: "GET",
    //         // token used to validate the API call
    //         headers: { Authorization: `Bearer ${token}`},
    //     });

    //     const data = await response.json();
    //     dispatch(setPosts(data));


    // };

    const getUserPosts = async() => {
        const response = await fetch(`http://localhost:3001/posts/${userId}/posts`, {
            method: "GET",
            // token used to validate the API call
            headers: { Authorization: `Bearer ${token}`},
        });

        const data = await response.json();
        dispatch(setPosts({posts: data}));
    };

    useEffect(() => {
        if(isProfile) {
            getUserPosts();
        } else {
            getPosts();
        }
    }, []); // eslint-disable-next-line react-hooks/exhaustive-deps


    return (
        <>
          {Array.from(posts).map(
            ({
              _id,
              userId,
              firstName,
              lastName,
              description,
              location,
              picturePath,
              userPicturePath,
              likes,
              comments,
            }) => (
              <PostWidget
                key={_id}
                postId={_id}
                postUserId={userId}
                name={`${firstName} ${lastName}`}
                description={description}
                location={location}
                picturePath={picturePath}
                userPicturePath={userPicturePath}
                likes={likes}
                comments={comments}
              />
            )
          )}
        </>
      );
    };
    
    export default PostsWidget;