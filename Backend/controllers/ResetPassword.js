import { compareSync } from "bcrypt";
import User from "../models/User";
import mailSender from "../utils/mailSender";
import bcrypt from "bcrypt";

//reset password token
exports.resetPasswordToken=async (req,res)=>{
    try{
        // get email from req body
        const email=req.body;

        // cheak user for this email,email validation
       const user=await User.findOne({email:email});

       if(!user){
        return res.json({
            success:false,
            message:"Your User is not registered"
        });
       }
        // generate token
        const token=crypto.randomUUID();
        //upddate user by adding token and expiration time
        const updatedDetails=await User.findOneAndUpdate(
                                        {email:email},
                                        {
                                            token:token,
                                            resetPasswordExpires:Date.now()+5*60*1000,
                                        },
                                        {new:true});
        //create url
        const url=`http://localhost:3000/update-password/${token}`;
        //send mail containg the url
        await mailSender(email,
            "Password Reset Link",
            `Password Reset Link : ${url}`,
        );
        //return response
        return res.json({
            success:true,
            message:"Email Send Successfully, Please Change your password ",
        })
        
    } catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Something is Wrong in Reset Password",
        })
    }
};
// reset password

exports.ResetPassword=async (req,res)=>{
    try{
        //data fetch
        const {password,confirmPassword,token}=req.body;
        //validation
        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:"Password not matching",
            });
        }
        //get userDetails from db using token
        const userDetails=await user.findOne({token:token});

        //if no entry- invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"Token is invalid",
            });
        }
        //token time cheak
        if(userDetails.resetPasswordExpires<Date.now()){
            return res.json({
                success:false,
                message:"Token is expired "
            })
        }
        //hash password
        const hashedPassword=await bcrypt.hash(password,10);

        //password update
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        );

        //return response
        return res.status(200).json({
            success:true,
            message:"Password has been Successfully Update",
        })
    } catch(error){
        console.log(error);
        res.status(403).json({
            success:false,
            message:"Something is Wrong ",
        })
    }
}