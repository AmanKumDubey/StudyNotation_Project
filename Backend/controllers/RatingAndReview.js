import RatingAndReview from "../models/RatingAndReview";
import Course from "../models/Course";
import mongoose from "mongoose";

//creatingRating

exports.createRating=async (req,res)=>{
    try{
        //get User Id
        const userId=req.body.user.id;
        //frtch data from re body
        const {rating, review, courseId}= req.body;

        //cheak if user is enrolled or not

        const couseDetails=await Course.findOne({
            _id:courseId,
            studentsEnrolled:{$eleMatch:{$req:userId}},
        });

        if(!couseDetails){
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in the Course"
            });
        }

        //cheak if user is already reviewed the course
        const alreadyReviews=await RatingAndReview.findOne(
            {
                user:userId,
                Course:courseId,
            }
        );
        if(!alreadyReviews){
            return res.status(404).json({
                success:false,
                message:"Course is already reviewed by the user",
            });
        }

        //create rating and reviews
        const ratingReview=await RatingAndReview.create(
            {
                rating,review,
                Course:courseId,
                user:userId,
            }
        );

        //update course with this rating/reviews
        const updateCourseDetails=await Course.findByIdAndUpdate({_id:courseId},
            {
                $push:{
                    RatingAndReview:ratingReview._id,
                }
            },
            {new:true}
        );

        console.log(updateCourseDetails);
        //return response
        return res.status(200).json({
            success:true,
            message:"Rating and Reviews created successfully",
            ratingReview,
        })
    } catch(error){
        console.log(error);
        return res.status(402).json({
                success:false,
                message:error.message,
        })
    }
}

////getAverage Rating

exports.getAverage=async (req,res)=>{
    try{
        //get couse ID
        const courseId=req.body.courseId;
        //calculating average rating
        const result=await RatingAndReview.aggregate([
            {
                $match:{
                    Course:new mongoose.Types.ObjectId(courseId),
                }
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"},
                }
            }
        ])
        //return rating

        if(result.length>0){
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            });
        }
        //if no rating and reviews exists

        return res.status(200).json({
            success:true,
            message:"Average Rating is 0, no rating given till now",
            averageRating:0
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//get all rating and reviews
exports.getAllRatingAndReviews=async (req,res)=>{
    try{
        const allreviews= await RatingAndReview.find({})
                                .sort({rating:"desc"})
                                .populate({
                                    path:"user",
                                    select:"firstName lastName email image",
                                })
                                .populate({
                                    path:"course",
                                    select:"courseName",
                                })
        return res.status(200).json({
            success:true,
            message:"All reviews fetched successfully",
            data:allreviews,
        })
    } catch(error){
        console.log(error);
        return res.status(404).json({
            success:false,
            message:error.message,
        })
    }
}