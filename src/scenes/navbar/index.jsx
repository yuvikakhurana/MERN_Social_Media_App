import { useState } from "react";
import { Box, IconButton, InputBase, Typography, Select, MenuItem, FormControl, useTheme, useMediaQuery, Icon } from "@mui/material";
import { Search, Message, DarkMode, LightMode, Notifications, Help, Menu, Close  } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {setMode, setLogout} from "state";
import { useNavigate } from "react-router-dom";
import FlexBetween from "components/FlexBetween";



const Navbar = () => {

    //used if we want to open the menu when its is small screen like mobiles
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
    
    // SETTING the state
    const dispatch = useDispatch();

    const navigate = useNavigate();

    //GETTING the user state
    const user = useSelector((state) => state.user);

    //useMediaQuery - built in hook in MUI
    //media query used to determine if the screen size is below certain minWidth / maxWidth
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

    //allows you to access the theme object defined by ThemeProvider in aPP.JS
    const theme = useTheme();

    //accessing the colors using the theme object
    const neutralLight = theme.palette.neutral.light;
    const dark = theme.palette.neutral.dark;
    const background = theme.palette.background.default;
    const primaryLight = theme.palette.primary.light;
    const alt = theme.palette.background.alt;

    //DOUBT
    const fullName = `${user.firstName} ${user.lastName}`;

    //using this reusable component which has all the properties set in its file by default
    //here we are configuring different CSS properties like padding, backgroundColor and using it as a component property because we are using MUI components like Box for this
    //only available for Box component, for components like button need to use sx...
    return <FlexBetween padding="1rem 6%" backgroundColor={alt}>
        <FlexBetween gap="1.75rem" >

            
            <Typography 
                fontWeight="bold" 
                fontSize="clamp(1rem, 2rem, 2.25rem)" 
                color="primary" 
                onClick={() => navigate("/home")}
                sx={{
                    "&:hover" : {
                        color: primaryLight, 
                        cursor: "pointer",
                    },
                }}

            >
             Connectify
            </Typography>
            {isNonMobileScreens && (
                <FlexBetween backgroundColor={neutralLight} borderRadius="9px" gap="3rem" padding="0.1rem 1.5rem">
                    <InputBase placeholder="Search..." />
                    <IconButton>
                        <Search/>
                    </IconButton>
                </FlexBetween>
            )}
        </FlexBetween>

        {/* DESKTOP NAV */}
        {isNonMobileScreens ? (
            <FlexBetween gap="2rem">
                <IconButton onClick={() => dispatch(setMode())}>
                   {theme.palette.mode === "dark" ? (
                     <DarkMode sx={{fontSize: "25"}} />
                   ) : (
                    <LightMode sx={{color: dark, fontSize: "25px"}} />
                   )} 
                </IconButton>
                <Message sx={{fontSize: "25"}} />
                <Notifications sx={{fontSize: "25"}} />
                <Help sx={{fontSize: "25"}} />
                <FormControl variant="standard" value={fullName}>
                    <Select 
                     value={fullName}
                     sx={{
                        backgroundColor: neutralLight, 
                        width: "150px",
                        borderRadius: "0.25rem",
                        p: "0.25rem 1rem",
                        "& .MuiSvgIcon-root" : {
                            pr: "0.25rem", 
                            width: "3rem"
                        },
                        "& .MuiSelect-select:focus" : {
                            backgroundColor: neutralLight
                        }

                     }}

                     input={<InputBase />}
                    >
                        <MenuItem value={fullName}>
                            <Typography>{fullName}</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => dispatch(setLogout()) }>Log Out</MenuItem>
                    </Select>
                </FormControl>
            </FlexBetween>  
        ) : ( 
        <IconButton
         onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}
        > 
            <Menu/>
        </IconButton>)}

        {/* MOBILE NAV */}

        {!isNonMobileScreens && isMobileMenuToggled && (
            <Box
                position="fixed"
                right="0"
                bottom="0"
                height="100%"
                zIndex="10"
                maxWidth="500px"
                minWidth="300px"
                backgroundColor={background}
            >

            {/* CLOSE ICON */}
            <Box display="flex" justifyContent="flex-end" p="1rem">
                <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
                    <Close />
                </IconButton>
            </Box>

            {/* MENU ITEMS */}
            <FlexBetween display="flex"  flexDirection="column" justifyContent="center" alignItems="center" gap="3rem">
                <IconButton onClick={() => dispatch(setMode())} sx={{fontSize: "25"}} >
                   {theme.palette.mode === "dark" ? (
                     <DarkMode sx={{fontSize: "25"}} />
                   ) : (
                    <LightMode sx={{color: dark, fontSize: "25px"}} />
                   )} 
                </IconButton>
                <Message sx={{fontSize: "25"}} />
                <Notifications sx={{fontSize: "25"}} />
                <Help sx={{fontSize: "25"}} />
                <FormControl variant="standard" value={fullName}>
                    <Select 
                     value={fullName}
                     sx={{
                        backgroundColor: neutralLight, 
                        width: "150px",
                        borderRadius: "0.25rem",
                        p: "0.25rem 1rem",
                        "& .MuiSvgIcon-root" : {
                            pr: "0.25rem", 
                            width: "3rem"
                        },
                        "& .MuiSelect-select:focus" : {
                            backgroundColor: neutralLight
                        }

                     }}

                     input={<InputBase />}
                    >
                        <MenuItem value={fullName}>
                            <Typography>{fullName}</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => dispatch(setLogout()) }>Log Out</MenuItem>
                    </Select>
                </FormControl>
            </FlexBetween>  
            

            </Box>
        )}
    </FlexBetween>


};

export default Navbar;