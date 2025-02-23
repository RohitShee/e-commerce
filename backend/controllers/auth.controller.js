import { redis } from "../lib/redis.js";
import User from "../models/user.model.js"
import jwt from 'jsonwebtoken';

const generateTokens = (userId) => {
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'});
    return {accessToken,refreshToken};
}

const storeRefreshToken = async(userId, refreshToken) => {
    // store the refresh token in the redis store
    await redis.set(`refresh_token:${userId}`,refreshToken,"EX", 7*24*60*60);
}

const setCookies = (res,accessToken,refreshToken) => {
    res.cookie("accessToken",accessToken, {
        httpOnly : true,//prevent XSS attack
        secure : process.env.NODE_ENV === 'production',//only send cookie over https in production
        sameSite : 'strict',//prevent CSRF attack
        maxAge : 15*60*1000//15 minutes
    })
    res.cookie("refreshToken",refreshToken, {
        httpOnly : true,//prevent XSS attack
        secure : process.env.NODE_ENV === 'production',//only send cookie over https in production
        sameSite : 'strict',//prevent CSRF attack
        maxAge : 7*24*60*60*1000//7 days
    })
}
export const signup = async(req,res)=>{
    const {email,password,name} = req.body  
    try {

        //console.log(name,email,password);
        const userExists = await User.findOne({email});

        if(userExists) return res.status(400).json({message : "User already exists"});

        const user = await User.create({
            name,
            email,
            password
        })
        
        const {accessToken,refreshToken} = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res,accessToken,refreshToken);
        res.status(201).json({
                _id : user._id,
                name : user.name,
                email : user.email,
                role : user.role           
        });
    } catch (error) {
        console.log("error in signup",error);
        res.status(500).json({message : error.message});
    }
}

export const login = async(req,res)=>{
   try {
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(!user) return res.status(400).json({message : "User not found"});

    if(user && (await user.comparePassword(password))){
        const {accessToken,refreshToken} = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res,accessToken,refreshToken);
        res.status(200).json({
                _id : user._id,
                name : user.name,
                email : user.email,
                role : user.role           
        });
    }else{
        res.status(400).json({message : "Invalid credentials"});
    }

   } catch (error) {
         console.log("error in login",error);
        res.status(500).json({message : error.message});
   }
}

export const logout = async(req,res)=>{
   try {
    const refreshToken = req.cookies.refreshToken;
    if(refreshToken){
        const {userId} = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        await redis.del(`refresh_token:${userId}`);
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({message : "logged out successfully"});
   } catch (error) {
    console.log("error in logout",error);
    res.status(500).json({message : error.message});
   }
}

//recreate access token from refresh token
export const refreshToken = async(req,res)=>{
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401).json({message : "User not authenticated"});
        const {userId} = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
        const token = await redis.get(`refresh_token:${userId}`);
        if(token !== refreshToken) return res.status(401).json({message : "User not authenticated"});
        const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'});
        res.cookie("accessToken",accessToken, {
            httpOnly : true,
            secure : process.env.NODE_ENV === 'production',
            sameSite : 'strict',
            maxAge : 15*60*1000
        })
        res.status(200).json({message : "access token regenerated"});
    } catch (error) {
        console.log("error in refreshToken",error);
        res.status(500).json({message : error.message});
    }
}

export const getProfile = async(req,res)=>{
    try {
        
    } catch (error) {
        
    }
}