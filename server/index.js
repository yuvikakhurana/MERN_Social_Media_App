import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { error } from "console";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import {register} from "./controllers/auth.js";
import {createPost} from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";
import User from "./models/User.js";
import Post from "./models/Posts.js";
import {users, posts} from "./data/index.js";

/* CONFIGURATIONS */
//  console.log(import.meta.url);

//Giving the absolute path for the file of the current module 
//First getting its Absolute URL then converting it to path using the fileURLToPath function
const __fileName = fileURLToPath(import.meta.url);

//returns directory name from a path
const __dirName = path.dirname(__fileName);


dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb", extended: true}));
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}));
app.use(cors());
app.use("/assets", express.static(path.join(__dirName, 'public/assets')));


/* FILE STORAGE */
//diskStorage: sepcifies how the uploaded files should be stored on the server's disk
//Destination is where file will be stored
//FileName is the name by which it will be saved in the destination (we are using file's original name)
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/assets");
    }, 
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

//Will help save the uploaded file to storage
//Anytime we will upload the file wqe will use this variable
const upload = multer({storage});


/* ROUTES WITH FILES */
//need access to upload hence can't move this to separate file
app.post("/auth/register", upload.single("picture"), register);

// "picture" is the property , it will grab that (what it is set to) and upload it to our destination described above

app.post("/posts", verifyToken, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);

app.use("/users", userRoutes);

app.use("/posts", postRoutes);

/*MONGOOSE SETUP*/
// 6001 PORT just as a backup
const PORT = process.env.PORT || 6001;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    // Insert data only One time - hence after running once comment out
    // User.insertMany(users);
    // Post.insertMany(posts);
}) .catch((error) => console.log(`${error} did not connect`));



