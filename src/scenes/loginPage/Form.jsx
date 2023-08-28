import { useState } from "react";
import {
    Box, 
    Button, 
    TextField, 
    useMediaQuery, 
    Typography, 
    useTheme,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {Formik} from "formik";
//*: Import everything
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {setLogin} from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";


//These are yup VALIDATION schema
// will determine the shape of form libraries will save information
const registerSchema = yup.object().shape({
    //If the values are not inputted or dont match the datatype - will show an error and the message inputted
    firstName: yup.string().required("required"),
    lastName: yup.string().required("required"),
    //yup has already setup for email
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
    location: yup.string().required("required"),
    occupation: yup.string().required("required"),
    picture: yup.string().required("required"),
});

const loginSchema = yup.object().shape({
    email: yup.string().email("invalid email").required("required"),
    password: yup.string().required("required"),
});

//Above - sets up validation

//Below - sets up intial values

const initialValuesRegister = {
    firstName: "", 
    lastName: "", 
    email: "", 
    password: "", 
    location: "", 
    occupation: "", 
    picture: "",
}

const initialValuesLogin = {
    email: "", 
    password: "", 
}



const Form = () => {

    //PageType can be either login or register
    //will display form accordingly
    const [pageType, setPageType] = useState("login");
    const {palette} = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const isLogin = pageType === "login";
    const isRegister = pageType === "register";


    const register = async (values, onSubmitProps) => {


        // this allows us to send form info with image
        const formData = new FormData();

        //looping through all values and appending <K, V> pair in formData
        for(let value in values) {
            formData.append(value, values[value]);
        }

        //name of the file is its value / path
        formData.append('picturePath', values.picture.name)

        //sending the server at this path (first parameter) the type of request and request body (second parameter)
        const savedUserResponse = await fetch(
            "http://localhost:3001/auth/register", 
            {
                method: "POST", 
                body: formData
            }
        );

        //whatever we receive as response - saving here by converting it into json
        const savedUser = await savedUserResponse.json();

        //onSubmitProps provides a number of function with Formik
        onSubmitProps.resetForm();

        //If successfully registered:
        if(savedUser) {
            setPageType("login");
        }
    };

    const login = async (values, onSubmitProps) => {
        const loggedInResponse = await fetch(
            "http://localhost:3001/auth/login", 
            {
                method: "POST", 
                //need to add this header since we are not doing formData now
                headers: {"Content-Type": "application/json"}, 
                body: JSON.stringify(values),
            }
        );

        const loggedIn = await loggedInResponse.json();
        onSubmitProps.resetForm();

        //If user successfully authenticated:
        if(loggedIn) {
            dispatch(
                setLogin({
                    user: loggedIn.user, 
                    token: loggedIn.token,
                })
            );

            navigate("/home");
        }

    }

    //Function that will the handle the form submit corresponding to Login/Register Button
    const handleFormSubmit = async(values, onSubmitProps) => {

        if(isLogin) await login(values, onSubmitProps);
        if(isRegister) await register(values, onSubmitProps);


    };



    
    return (
    <Formik 
        onSubmit={handleFormSubmit} 
        initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
        validationSchema={isLogin ? loginSchema : registerSchema}
    >

    {({
        //these values you can use in your Components and the Form
        values, 
        errors, 
        touched, 
        handleBlur, 
        handleChange, 
        handleSubmit, 
        setFieldValue, 
        resetForm
    }) => (

        <form onSubmit={handleSubmit}>
            <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
                "& > div": {gridColumn: isNonMobile ? undefined : "span 4"},
            }}
            >

                
            {isRegister && (
                    <>
                        <TextField
                          label="First Name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.firstName}
                          name="firstName"
                          error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                          helperText={touched.firstName && errors.firstName}
                          sx={{ gridColumn: "span 2"}}
                        />
                        <TextField
                          label="Last Name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.lastName}
                          name="lastName"
                          error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                          helperText={touched.lastName && errors.lastName}
                          sx={{ gridColumn: "span 2"}}
                        />
                        <TextField
                          label="Location"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.location}
                          name="location"
                          error={Boolean(touched.location) && Boolean(errors.location)}
                          helperText={touched.location && errors.location}
                          sx={{ gridColumn: "span 4"}}
                        />
                        <TextField
                          label="Occupation"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.occupation}
                          name="occupation"
                          error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                          helperText={touched.occupation && errors.occupation}
                          sx={{ gridColumn: "span 4"}}
                        />
                        {/* Box of Inputting File Image */}
                        <Box 
                        gridColumn="span 4"
                        border={`1px solid ${palette.neutral.medium}`}
                        borderRadius="5px"
                        p="1rem"
                        >
                        <Dropzone
                            acceptedFiles=".jpg,.jpeg,.png"
                            multiple={false}
                            onDrop={(acceptedFiles) => 
                                setFieldValue("picture", acceptedFiles[0])
                            }
                        > 
                            {/* - The following are of DropZone 
                                - Need to  pass in the getRootProps in the div immedietly underneath or in its root
                                - similarly for input you need to pass inputProps
                             */}
                            {({ getRootProps, getInputProps }) => (
                                <Box
                                    {...getRootProps()}
                                    border={`2px dashed ${palette.primary.main}`}
                                    p="1rem"
                                    sx={{"&:hover": {cursor: "pointer"}}}
                                >
                                   <input {...getInputProps()} />
                                    {!values.picture ? (
                                        <p>Add Picture Here</p>
                                    ) : (
                                        <FlexBetween>
                                            <Typography>{values.picture.name}</Typography>
                                            <EditOutlinedIcon/>
                                        </FlexBetween>
                                    )}


                                </Box>


                            )}

                        </Dropzone>

                    </Box>

                    </>
                )}

                
                {/* Section for both Login and Register - above is only for Register */}

                <TextField
                          label="Email"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.email}
                          name="email"
                          error={Boolean(touched.email) && Boolean(errors.email)}
                          helperText={touched.email && errors.email}
                          sx={{ gridColumn: "span 4"}}
                />
                <TextField
                          label="Password"
                          type="password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.password}
                          name="password"
                          error={Boolean(touched.password) && Boolean(errors.password)}
                          helperText={touched.password && errors.password}
                          sx={{ gridColumn: "span 4"}}
                />
            </Box>
            
            {/* BUTTONS */}

            <Box>
                <Button
                    fullWidth
                    type="submit"
                    sx={{
                        m: "2rem 0", 
                        p: "1rem",
                        backgroundColor: palette.primary.main,
                        color: palette.background.alt,
                        "&:hover" : {color: palette.primary.main },
                    }}
                >

                    {isLogin ? "LOGIN" : "REGISTER"}
                </Button>


                <Typography
                onClick={() => {
                    setPageType(isLogin ? "register" : "login");
                    
                    //will reset / clear out the form (all inputs and everything)
                    resetForm();
                }}

                sx={{
                    textDecoration: "underline", 
                    color: palette.primary.main, 
                    "&:hover" : {
                        cursor: "pointer", 
                        color: palette.primary.light,
                    }
                }}
                >

                    {isLogin ? "Don't have an account? Sign Up here." : "Already have an account? Login Here"}

                </Typography>

            </Box>

        </form>

    )}
    </Formik>
    );
};

export default Form;
 

