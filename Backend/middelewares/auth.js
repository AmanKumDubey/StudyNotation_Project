import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import User from "../models/User";

dotenv.config();

//auth
exports.auth=async (req,res,next)=>{

    try{
        //extract token
        const token=req.cooies.token
                    || req.body.token
                    || req.header("Authorisation").replace("Bearer ","");

                    // if token missing, then return response

                    if(!token){
                        return res.status(401).json({
                            success:false,
                            message:"Token is missing",
                        });
                    }
        // verifying the token 
        try{
            const decode= jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        } catch(error){
            return res.status(402).json({
                success:false,
                message:"token is invalid ",
            });
        }
        next();
    } catch(error){
        console.log(error);
        res.status(401).json({
            success:false,
            message:"Something Went Wrong"
        })
    }
}

// isStudent
exports.isStudent = async (req,res,next)=>{
    try{
        if(req.user.accountType!=="student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Students only ",
            });
        }
        next();
    } catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"User role cannot be verified,"
        })
    }
}

// Is Instructor

exports.isInstructor = async (req,res,next)=>{
    try{
        if(req.user.accountType!=="instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Students only ",
            });
        }
        next();
    } catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"User role cannot be verified,"
        })
    }
}

// is Admin

exports.isAdmin = async (req,res,next)=>{
    try{
        if(req.user.accountType!=="admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Students only ",
            });
        }
        next();
    } catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"User role cannot be verified,"
        })
    }
}


