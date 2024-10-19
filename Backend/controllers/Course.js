import Course from "../models/Course";
import User from "../models/User";
import Category from "../models/Category"
import {uploadImageToCloudinary} from "../utils/imageUploader";


//createCouse Handler Function

exports.createCourse=async(req,res)=>{
    try{
         //fetch data
         const {courseName,courseDescription,whatYouWillLearn,price,tag}=req.body;

         //get thumnail
         const thumnail=req.files.thumnailImage;

         //validation
         if(!courseName || !courseDescription || !whatYouWillLearn || !price || !thumnail){
            return res.status(400).json({
                success:false,
                message:"All Filed Required",
            })
         }

         if(!status || status===undefined){
            status="Draft";
         }
         // cheak for instructor
         const userId=req.user.id;
         const instructorDetails=await User.findByid(userId,{accountType:"Instructor"});
         console.log("Instructor Details ",instructorDetails);

         if(!instructorDetails){
            return res.status(404).json({
                success:false,
                message:"Instructor Details not found ",
            })
         }

        const categoryDetails=await Category.findById(tag);
         if(!categoryDetails){
            return res.status(404).json({
                success:false,
                message:"Category Details not found ",
            })
         }
         const thumnailImage=await uploadImageToCloudinary(
                                    thumnail,
                                    process.env.FOLDER_NAME

         );
         console.log(thumnailImage);
         //create an entry for new Course with the given details
         const newCourse=await Course.create({
                    courseName,
                    courseDescription,
                    instructor:instructorDetails._id,
                    whatYouWillLearn:whatYouWillLearn,
                    price,
                    tag:tag,
                    Category:categoryDetails._id,
                    thumnail:thumnailImage.secure_url,
                    status:status,
                    instructions:instructions,
         });

         //add the new Course to the user schemma of instructor
         await User.findByIdAndUpdate(
                    {_id:instructorDetails._id},
                    {
                        $push:{
                            courses:newCourse._id,
                        }
                    },  
                    {new:true}
         )
         // Return the new Course and a success message
         res.status(200).json({
            success:true,
            message:"Course Created Successfully ",
         });

    } catch(error){
        console.log(error);
        res.status(401).json({
            success:false,
            message:error.message,
        })
    }
}

// getAllCourse handler function

exports.getAllCourses=async (req,res)=>{
    try{
        const allCourses=await Course.find(
                    {},
                    {
                        courseName:true,
                        price:true,
                        thumnail:true,
                        instructor:true,
                        ratingAndReviews:true,
                        studentsEnrolled:true,
                    }
        ).populate("instructor").exec();

        return res.status(200).json({
            success:true,
            message:"Data for all courses fetched Successfully ",
            data:allCourses,
        })
    } catch(error){
            console.log(error);
            return res.status(404).json({
                success:false,
                message:`Cannot Fetch Course Data`,
                error:error.message,
            });
    }
};

// getCourseDetails
exports.getAllCourses=async (req,res)=>{
    try{
            //get id
            const {courseId}=req.body;
            //find course details
            const courseDetails=await Course.find(
                {_id:courseId}
            ).populate(
           {
            path:"instructor",
            populate:{
                populate:{
                    path:"additionalDetails",
                }
            }
           }    
            ).populate("category")
            .populate({
                path:"courseContent",
                populate:{
                    path:"subSection",
                },
            })
            .exec();

            //validation
            if(!courseDetails){
                return res.status(400).json({
                    success:false,
                    message:`Could not find the course with ${courseId}`,
                })
            }

            return res.status(200).json({
                success:true,
                message:"Course Details Fetched Successfully",
                data:courseDetails,
            })
    } catch(error){
            console.log(error);
            res.status(400).json({
                success:false,
                message:error.message,
            });
    }
};