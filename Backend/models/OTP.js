import mongoose from "mongoose";
import mailSender from "../utils/mailSender"
const otpScheama= new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,

    },
    createdAt : {
        type:Date,
        default:Date.now(),
        expires:5*60,
    }
});

// Function to send Email
async function sendVerificationMail(email,otp) {
        try{
            const mailResponse=await mailSender(eamil,"Verification Email from StudyNotation",otp);
            console.log("Email Send Successfully ", mailResponse);
        } catch(error){
            console.error(error);
            throw error;
        }
}

otpScheama.pre("save",async function(next) {
    await sendVerificationMail(this.email,this.otp);
    next();
})
module.exports=mongoose.model("OTP",otpScheama);