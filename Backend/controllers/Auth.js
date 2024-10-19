import User from "../models/User.js";
import OTP from "../models/OTP";
import otpGenerator from "otp-generator";
import { errorMonitor } from "nodemailer/lib/xoauth2/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mailSender from "../utils/mailSender.js";

// SendOTp

exports.sendOTP= async (req,res)=>{

    try{
        // fetch email from request's body

        const {email}=req.body;
        // cheak user is exist or not
        const cheakUser=await User.findOne({email});

        // if user already exist

        if(cheakUser){
            return res.status(401).json({
                success:false,
                message:"User alredy registered ",
            })
        }

        // generate otp
        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });

        console.log("opt generate ",otp);
        //cheak unique otp or not
        const result=await OTP.findOne({otp:otp});

        while(result){
            otp=otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result=await OTP.findOne({otp:otp});
        }
        const otppayload={email,otp};

        // create an entry for otp
        const otpbody=await OTP.create(otppayload);
        console.log("OTP BODY",otppayload);


        // return resposnse
        res.status(200).json({
           success:true,
           message:"OTP Sent Successfully",
           otp
        })

    } catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

// Signup
exports.signUp= async(req,res)=>{

    try{
        const {firstname,
            lastname,
            email,
            password,
            confirmPassword,
            accountType,
            constactType,
            otp
        }=req.body;
    
        // validate user
        if(!firstname||
            !lastname||
            !otp||
            !email||
            !password||
            !confirmPassword
        ){
            return res.status(403).json({
                success:false,
                message:"All field are required",
            })
        }
    
        // password match kro
    
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and confirmpassword does not match ",
            })
        }
        // cheak user exist or not
        const userExist=await User.findOne({email});
        if(userExist){
            return res.status(400).json({
                success:false,
                message:"User already Exist !",
            })
        }
        // find most recent Otp stores fro the user
        const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
        //validate OTP
        if(recentOtp.length==0){
            // OTP not found
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            })
        }
    
        // Hash Password
        const hashedPassword=await bcrypt.hash(password,10);
    
        //entry create in DB
        const profileDetails=await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        })
    
        const user=await User.create({
            firstname,
            lastname,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image:'https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}',
            
        })
    
        // return res
        res.status(200).json({
            success:true,
            message:"User is registered Successfully ",
            user,
        })
    } catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"User Can not be registered ",
        })
    }
}

// Login
exports.login= async (req,res)=>{
    try{
        // get data from req.body
        const {email,password}=req.body;
        //validate data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All Field are required !",
            })
        }
        // user cheak exist or not
        const user= await user.findOne({email}).populate("additionalDetails");

        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered ",
            })
        }

        // generate JWT , after password matching

        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType,
            }
            const token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
            })
            user.token=token;
            user.password=undefined;

            // create cookie
            const options={
                expires:new Date(Date.now()+3*24*60*60*100),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in Successfully",
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect ",
            })
        }
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login Failure, please try again ",
        })
    }
}

// Changepassword

exports.changePassword=async (req,res)=>{

    try{
        // get user data from req.user
        const userDetails=await User.findById(req.user.id);
        // get old and new password

        const {oldPassword,newPassword}=req.body;

        //validate old password
        const isPasswordMatch=await bcrypt.compare(
            oldPassword,
            userDetails.password,
        );

        if(!isPasswordMatch){
            return res.json({
                success:false,
                message:"Incorrect Password ",
            })
        }

        //update password

        const encryptedpassword=await bcrypt.hash(newPassword,10);
        const updatedUserDetails=await User.findByIdAndUpdate(
            req.user.id,
            {password:encryptedpassword},
            {new:true}

        );

        //send notification email
        try{
            const emailResponse=await mailSender(
                updatedUserDetails.email,
                `password Updated Successfully for ${updatedUserDetails.firstname} ${updatedUserDetails.lastname}`,
                passwordUpdated(
                    updatedUserDetails.email,
                    updatedUserDetails.firstname,
                )
            )
            console.log('Email sent successfully ........',emailResponse);
        } catch(error){
   console.log("Error Occured while Sending Email",error);
   return res.status(500).json({
    success:false,
    message:"Error Occuring While Sending Email",
    error:error.message,
   })
        }
    } catch(error){
        console.log(error);
        res.status(403).json({
            success:false,
            message:"Password didn't change, Please Try again",
        });
    }
};