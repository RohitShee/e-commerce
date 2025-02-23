import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
export const protectRoute = async(req,res,next) =>{
    try {
       const accessToken = req.cookies.accessToken;

       if(!accessToken) return res.status(401).json({message : "User not authenticated"});
       const {userId} =jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);

       const user = await User.findById(userId).select("-password");
       if(!user) return res.status(401).json({message : "User not authenticated" });
       req.user = user;
       next();
    } catch (error) {
        console.log("error in productRoute",error);
        res.status(500).json({message : error.message});
    }
}

export const adminRoute = async(req,res,next) =>{
    try {
        if(req.user && req.user.role === "admin"){
            next();
        }else{
            res.status(403).json({message : "Access Denied - admin only"});
        }
    } catch (error) {
        console.log("error in adminRoute",error);
        res.status(500).json({message : error.message});
    }
}