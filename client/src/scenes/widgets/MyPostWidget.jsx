import { 
    EditOutlined,
    DeleteOutlined, 
    AttachFileOutlined, 
    GifBoxOutlined, 
    ImageOutlined, 
    MicOutlined, 
    MoreHorizOutlined
} from "@mui/icons-material";
import {
    Box, 
    Divider, 
    Typography, 
    InputBase, 
    useTheme, 
    Button,
    IconButton, 
    useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";

const MyPostWidget = ({ picturePath }) => {
    const dispatch = useDispatch();

    //represent the switch if someone has clicked the image button to drop the image they want
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    //will represent post content of description
    const [post, setPost] = useState("");
    const { palette } = useTheme();
    //can send this to backend - to know who is posting
    const { _id } = useSelector((state) => state.user);
    //will be used to authorize the user
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;


    const handlePost = async () => {
       
        //need to use formData since we will sending image data
        const formData = new FormData();
        formData.append("userId", _id);
        formData.append("description", post);
        if(image) {
            //see server - we have upload.single("picture") - "picture" is the key
            formData.append("picture", image);
            //.name will determine the path for image
            formData.append("picturePath", image.name)
        }

        const response = await fetch(`http://localhost:3001/posts`, {
            method: "POST", 
            headers: {Authorization: `Bearer ${token}`}, 
            body: formData
        });

        // backend will return the updated list of (all) posts
        const posts = await response.json();
        //The set post(s) is the action from redux store
        //The set post is the use state we are using for the description of the post we are adding
        dispatch(setPosts({posts: posts}));

        //will reset what we have once we make the API call
        setImage(null);
        setPost("");
    };

    return (
        <WidgetWrapper>
            <FlexBetween gap="1.5rem">
                <UserImage image={picturePath}/>
                {/* Controlled component: */}
                <InputBase 
                    placeholder="What's on your mind..."
                    onChange={(e) => setPost(e.target.value)}
                    value={post}
                    sx={{
                        width: "100%",
                        backgroundColor: palette.neutral.light, 
                        borderRadius: "2rem",
                        padding: "1rem 2rem"
                    }}
                />
            </FlexBetween>

            {/* if they clicked the image button: */}
            {isImage &&(
                <Box
                    border={`1px solid ${medium}`}
                    borderRadius="5px"
                    mt="1rem"
                    p="1rem"
                >

                        <Dropzone
                            acceptedFiles=".jpg,.jpeg,.png"
                            multiple={false}
                            onDrop={(acceptedFiles) => 
                                setImage(acceptedFiles[0])
                            }
                        > 
                            {/* - The following are of DropZone 
                                - Need to  pass in the getRootProps in the div immedietly underneath or in its root
                                - similarly for input you need to pass inputProps
                             */}
                            {({ getRootProps, getInputProps }) => (
                                <FlexBetween>
                                    <Box
                                        {...getRootProps()}
                                        border={`2px dashed ${palette.primary.main}`}
                                        p="1rem"
                                        width="100%"
                                        sx={{"&:hover": {cursor: "pointer"}}}
                                    >
                                    <input {...getInputProps()} />
                                        {!image ? (
                                            <p>Add Image Here</p>
                                        ) : (
                                            <FlexBetween>
                                                <Typography>{image.name}</Typography>
                                                <EditOutlined/>
                                            </FlexBetween>
                                        )}


                                    </Box>
                                    
                                    {image && (
                                        <IconButton
                                            onClick={() => setImage(null)}
                                            sx={{ width: "15%"}}
                                        >
                                            <DeleteOutlined />

                                        </IconButton>
                                    )}

                                </FlexBetween>


                            )}

                        </Dropzone>

                </Box>
            )}

            <Divider sx={{ margin: "1.25rem 0"}} />

            <FlexBetween>
                <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
                    <ImageOutlined sx={{color: mediumMain}}/>
                    <Typography
                        color={mediumMain}
                        sx={{"&:hover": {cursor: "pointer", color: medium}}}

                    >
                        Image
                    </Typography>
                </FlexBetween>
                
                {isNonMobileScreens ? (
                    <>
                        <FlexBetween gap="0.25rem">
                            <GifBoxOutlined sx={{color: mediumMain}} />
                            <Typography color={mediumMain}>Clip</Typography>
                        </FlexBetween>

                        <FlexBetween gap="0.25rem">
                            <AttachFileOutlined sx={{color: mediumMain}} />
                            <Typography color={mediumMain}>Attachment</Typography>
                        </FlexBetween>

                        <FlexBetween gap="0.25rem">
                            <MicOutlined sx={{color: mediumMain}} />
                            <Typography color={mediumMain}>Audio</Typography>
                        </FlexBetween>

                        
                    </>
                ): (<FlexBetween gap="0.25rem"> 
                      <MoreHorizOutlined sx={{color: mediumMain}} /> 
                </FlexBetween>) }

                <Button
                   disabled={!post}
                   onClick={handlePost} 
                   sx={{
                        color: palette.background.alt,
                        backgroundColor: palette.primary.main,
                        borderRadius: "3rem"
                   }}
                >
                    POST
                </Button>

            </FlexBetween>
        </WidgetWrapper>
    )


};

export default MyPostWidget;
