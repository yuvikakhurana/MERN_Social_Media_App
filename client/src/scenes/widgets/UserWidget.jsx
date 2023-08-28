import {
    ManageAccountsOutlined, 
    EditOutlined, 
    LocationOnOutlined, 
    WorkOutlineOutlined,
} from "@mui/icons-material";

import {Box, Typography, Divider, useTheme} from "@mui/material";
import UserImage from "components/UserImage";
import FlexBetween from "components/FlexBetween";
import WidgetWrapper from "components/WidgetWrapper";
import { useSelector } from "react-redux";
import {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";

//DOUBT: why are parameters in {} - are they objects?
//these are props
const UserWidget = ({userId, picturePath}) => {

    const[user, setUser] = useState(null);
    const {palette} = useTheme();
    const navigate = useNavigate();
    const token = useSelector((state) => state.token);
    const dark = palette.neutral.dark;
    const medium = palette.neutral.medium;
    const main = palette.neutral.main;

    const getUser = async () => {
        const response = await fetch(`http://localhost:3001/users/${userId}`,
        {
            method: "GET", 
            //See server section to match
            headers: { Authorization: `Bearer ${token}`}

        });

        //Saving the response we are getting after converting it to jSON
        const data = await response.json();
        
        //Setting the User to the user info we get after token verification
        setUser(data);
    }

    //Getuser will be called when you render this component first time
    useEffect(() => {
        getUser();
    }, []) // eslint-disable-line-react-hooks/exhausitive-deps

    //Will always show up 
    //Typically have a loading compnent here
    if(!user) {
        return null;
    }

    const {
        firstName, 
        lastName, 
        location, 
        occupation, 
        viewedProfile, 
        impressions, 
        friends,
    } = user;

    return (
        <WidgetWrapper>
            {/* FIRST ROW  */}

            <FlexBetween
                gap="0.5rem"
                pb="1.1rem"
                onClick={() => navigate(`/profile/${userId}`)}

            >
                <FlexBetween gap="1rem">
                    <UserImage image={picturePath} />
                    <Box>
                        <Typography
                          variant="h4" 
                          color={dark}
                          fontWeight="500"
                          sx={{
                            "&:hover": {
                                color: palette.primary.light, 
                                cursor: "pointer"
                            }
                          }}>

                            {firstName} {lastName}

                        </Typography>
                        <Typography color={medium}>
                            {friends.length} friends
                        </Typography>
                    </Box>
                    
                </FlexBetween>
                <ManageAccountsOutlined />
                </FlexBetween>

                {/* Divider between first row and second row */}
                <Divider />

                {/* SECOND ROW */}

                <Box p="1rem 0">
                    <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
                        <LocationOnOutlined fontSize="large" sx={{ color: main}} />
                        <Typography color={medium}>{location}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap="1rem" >
                        <WorkOutlineOutlined fontSize="large" sx={{ color: main}} />
                        <Typography color={medium}>{occupation}</Typography>
                    </Box>
                </Box>

                <Divider />

                {/* THIRD ROW */}
                <Box p="1rem 0">
                    <FlexBetween mb="0.5rem">
                        <Typography color={medium}>Who's viewed your profile</Typography>
                        <Typography color={main} fontWeight="500">{viewedProfile}</Typography>
                    </FlexBetween>
                    <FlexBetween>
                        <Typography color={medium}>Impressions of your post</Typography>
                        <Typography color={main} fontWeight="500">{impressions}</Typography>
                    </FlexBetween>
                </Box>

                <Divider />

                {/* FOURTH ROW */}

                <Box p="1rem 0">
                    <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
                        Social Profiles
                    </Typography>
                    <FlexBetween gap="1rem" mb="0.5rem">
                        <FlexBetween gap="1rem">
                            <img src="../assets/twitter.png" alt="twitter" />
                            <Box>
                                <Typography color={main} fontFamily="500">
                                    Twitter
                                </Typography>
                                <Typography color={medium}>
                                    Social Network 
                                </Typography>
                            </Box>
                        </FlexBetween>
                        <EditOutlined sx={{ color: main}} />
                    </FlexBetween>


                    <FlexBetween gap="1rem" >
                        <FlexBetween gap="1rem">
                            <img src="../assets/linkedin.png" alt="linkedin" />
                            <Box>
                                <Typography color={main} fontFamily="500">
                                    Linkedin
                                </Typography>
                                <Typography color={medium}>
                                    Netword Platform 
                                </Typography>
                            </Box>
                        </FlexBetween>
                        <EditOutlined sx={{ color: main}} />
                    </FlexBetween>

                </Box>



        </WidgetWrapper>
    )

}


export default UserWidget;