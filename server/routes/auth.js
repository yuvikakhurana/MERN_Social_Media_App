import express from "express";
import { login } from "../controllers/auth.js";


//this will allow express to identify that these routes will all be configured and allows it to have in separate file
const router = express.Router();

router.post("/login", login);


export default router;
