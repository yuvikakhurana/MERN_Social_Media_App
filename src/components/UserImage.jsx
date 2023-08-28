import {Box} from "@mui/material";

//Profile Image for users
//image and size(if not set, this will be applied by default) are props
const UserImage = ({image, size="60px"}) => {
    return (
        //default height and width if we don't specify

        <Box width={size} height={size}>
            <img style={{objectFit: "cover", borderRadius: "50%"}}
            width={size}
            height={size}
            alt="user"

            //will grab the profile image for the users as needed
            src={`http://localhost:3001/assets/${image}`}

        />
        </Box>
    )
}

export default UserImage;