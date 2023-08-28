import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


/* REGISTER USER */


  



//async :used to define an asynchronous function - allows tasks to be performed in the background while pther parts of the program continue running
//call to mongo db - it whould be asynchronous
export const register = async (req, res) => {
   
    try {

        //destructring these items from req.body
        const {
            firstName, 
            lastName, 
            email, 
            password, 
            picturePath, 
            friends, 
            location,
            occupation
        } = req.body;

        //create a random salt provided by bcrypt
        //use this salt to encrypt our password
        const salt = await bcrypt.genSalt();

        //we will hash the password with the salt so that its not exposed
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User ({
            firstName, 
            lastName, 
            email, 
            password: passwordHash, 
            picturePath, 
            friends, 
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000), 
            impressions: Math.floor(Math.random() * 10000)
        });

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);

    } catch(err) {

        //Sending th error status code along with error message form mongo db
        res.status(500).json({error: err.message});
    }
};

/* LOGGING IN */

export const login = async (req, res) => {
    try {

        const {email, password} = req.body;

        //Using mongoose to find the user with the specified email
        const user = await User.findOne({email: email});

        if(!user) {
            return res.status(400).json({msg: "User does not exist." });
        } 

        //Using bcrypt to compare the passwords
        // will use same salt to compare if they turn out to be same hash
        const isMatch = await bcrypt.compare(password, user.password);

        //If they dont match
        if(!isMatch) {
            return res.status(400).json({msg: "Invalid credentials."});
        }

        //SIGN THE TOKEN WITH USER ID
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);

        //deleting user password to make sure it doesn't get sent to the frontend
        delete user.password;

        //sending status along with token and user
        res.status(200).json({token , user});

    } catch {
        //Sending th error status code along with error message form mongo db
        res.status(500).json({error: err.message});
    }   
}