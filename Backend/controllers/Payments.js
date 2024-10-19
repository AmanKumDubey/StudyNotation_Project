import {instance } from "../config/razorpay";
import Cousrse from "../models/User";
import User from "../models/User";
import mailSender from "../utils/mailSender";
import courseEnrollmentEmail from "../mail/templates/courseEnrollmentEmail";
import mongoose, { Cursor }  from "mongoose";


//capture the payment ND INITIATE THE razor order
exports.capturePayment=async (req,res)=>{
    //get couseId and UserId
    const {course_id}=req.body;
    const userId= req.user.id;

    //validation
    //valid CouseId

    if(!course_id){
        return res.status(400).json({
            success:false,
            message:"Please Provide valid User Id",
        })
    };

    //valid couse details
    let course;
    try{
        course=await course.findById(course_id);
        if(!course){
            return res.json({
                success:false,
                message:"Could not find the couse",
            })
        }

        //user already pay for the same couse
        const uuid=new mongoose.Types.ObjectId(userId);
        if(course.studentsEnrolled.includes(uuid)){
            return res.status(200).json({
                success:false,
                message:"Student is already enrolled",
            })
        }

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
    //order creates
    const amount=course.price;
    const corrency='INR';

    const options={
        amount:amount*100,
        corrency,
        recipt:Math.random(Date.now()).toString(),
        notes:{
            courseId:course_id,
            userId,
        }
    }

    try{
        //initialte the payment using razorpay
        const paymentResponse=await instance.orders.create(options);
        console.log(paymentResponse);

        //return response
        return res.status(200).json({
            success:true,
            courseName:course.courseName,
            courseDescription:Cousrse.courseDescription,
            thumnail:Cousrse.thumnail,
            orderId:paymentResponse.id,
            corrency:paymentResponse.currency,
            amount:paymentResponse.amount,
        });
    } catch(error){
        console.log(error);
        res.status(402).json({
            success:false,
            message:"Could not initiate order",
        })
    }
}

//verify Signature of RazorPay and Server
exports.verifySignature=async(req,res)=>{

    const webhookSecret='1234';
    const signature=req.headers("x-razorpay-signature");
    const shasum=crypto.createHmac("sha256",webhookSecret);
    shasum.update(JSON.stringify(req.body));
    const digset=shasum.digset("hex");


    if(signature===digset){
        console.log("Payment is Authorizes");
        const {courseId,userId}=req.body.payload.payment.entity.notes;
        try{
            //fullfill the action
            // find the course and enroll in it
            const enrolledCourse=await Course.findByIdAndUpdate(
                {id:courseId},
                {$push:{studentsEnrolled:userId}},
                {new:true},
            );
            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"Course not Found",
                });
            }
            console.log(enrolledCourse);

            //find the student and add the couse to their enrolled couse list
            const enrolledStudent =await User.findByIdAndUpdate(
                {id:userId},
                {$push:{Cousrse:courseId}},
                {new:true},
            );
            console.log(enrolledStudent);
            //send mail to confirmation to student
            const emailResonse=await mailSender(
                                        enrolledStudent.email,
                                        "Congratulations From Aman",
                                        "Congratulations, You are onboardered into new Couse",
            );
            console.log(emailResonse);
            return res.status(200).json({
                success:true,
                message:"Signature Verified and Couse Added",
            });
        } 
        catch(error){
            console.log(error);
            return res.status(403).json({
                success:false,
                message:"Invalid Request",
            })
        }
    }
}