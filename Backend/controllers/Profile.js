import Profile from "../models/Profile";
import User from "../models/User";
import {uploadImageToCloudinary} from "../utils/imageUploader";

//Method to updating Profile

exports.updateProfile=async(req,res)=>{
    try{
        //get data
        const {dateOfBirth='',about='',contactNumber,gender=''} =req.body;

        //get userid
        const id=req.user.id;

        //Find the profile by id
        const user= await User.findById(id);
        const profile=await profile.findById(user.additionalDetails);

        //update profile fields
        profile.dateOfBirth=dateOfBirth;
        profile.about=about;
        profile.contactNumber=contactNumber,
        profile.gender=gender;


        //Save the updated profile
        await profile.save();

        //return response
        return res.status(200).json({
            success:true,
            message:"Profile Updated Successfully ",
            profile,
        })
    
    } catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in Updating Profile",
            error:error.message,
        });   
    }
};

//delete account
exports.deleteAccount=async(req,res)=>{
    try{
        //get id
        const id=req.user.id;
        //validation of id
        const user=await User.findById({_id:id})
        //delete profile

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not Found",
            })
        }
        //delete associated profile with user
        await Profile.findByIdAndDelete({_id:user.additionalDetails});
        //Now delete user
        await User.findByIdAndDelete({_id:id});

        //return response
        return res.status(200).json({
            success:true,
            message:"User Dleted Successfully",
        })
    } catch(error){
        return res.status(500).json({
            success:false,
            message:"User Cannot Be Deleted",
            error:error.message,
        })
    }
}

exports.getAllUserDetails=async(req,res)=>{

    try{

        //get id
        const id=req.user.id;

        //validation and get user details
        const userDetails=await user.findById(id)
        .populate('additionalDetails').exec();
        console.log(userDetails);

        //return response
        return res.status(200).json({
            success:true,
            message:"User Data fetched Successfully ",
            data:userDetails,
        })
    } catch(error){
        console.log("Error While get all details ",error);
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

exports.updateDisplayPicture=async(req,res)=>{

    try{
        const displayPicture=req.files.displayPicture;
        const userId=req.user.id;
        const image=await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image);
        const updateProfile=await User.findByIdAndUpdate(
            {_id:userId},
            {image:image.secure_url},
            {new:true}
        )
        res.send({
            success:true,
            message:"Image Updated Successfully",
            data:updateProfile,
        })
    } catch(error){
        return res.status(403).json({
            success:false,
            message:error.message,
        })
    }
};


exports.getEnrolledCourses=async(req,res)=>{

    try{
        const userId=req.user.id;
        const userDetails=await User.findOne({
            _id:userId,
        }).populate('Courses').exec();

        if(!userDetails){
            return res.status(400).json({
                success:false,
                message:"Could Not Find ",
            });
        }
        return res.status(200).json({
            success:true,
            data:userDetails.courses,
        })
    } catch(error){
        res.status(400).json({
            success:false,
            message:error.message,
        })
    }
}