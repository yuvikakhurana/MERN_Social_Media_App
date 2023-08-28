import jwt from 'jsonwebtoken';

//next parameter will allow us to have the function continue
export const verifyToken = async (req, res, next) => {
    try {

        //From the request from the frontend, we are grabbing the Authorization header and that's where token will be set
        let token = req.header("Authorization");

        if(!token) {
            //If token does not even exist
            return res.status(403).send("Access Denied");
        }

        //we want token to start with bearer - will be done at frontend
        if(token.startsWith("Bearer ")) {
            token = token.slice(7, token.length).trimLeft();
        }

        //chECK WITH JWT TO VERIFY THE TOKEN USING OUR JWT_SECRET
        //If the verification is successful, it will return decoded payload of the JWT as a JS object
        // If the verification fails, it will throuw an error

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;

        //This is used for middleware functions to pass to control to next middleware or route handler in  chain 
        //Next function in the chain will precede the next step of this function
        //example: app.post(.., .., verifyToken, register): here we have verifyToken middleware and register is our next()
        next();

    } catch  (err) {
        res.status(500).json({error: err.message });
    }
}