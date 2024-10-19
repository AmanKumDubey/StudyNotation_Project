import Section from "../models/Section";
import Course from "../models/Course";

//create a new Section
exports.createSection=async (req,res)=>{

    try{
        //data fetch
        const {sectionName,courseId}=req.body;
        //data validation
        if(!findByIdAndUpdate || !courseId){
            return res.status(400).json({
                success:false,
                message:"Missing required properties ",
            })
        }

        //create a new section
        const newSection =await Section.create({sectionName});
        //update course with section objectID
        const updatedCourseDetails=await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            },
            {new:true},
        ).populate({
            path:"courseContent",
            populate:{
                path:"subSection",
            },
        }).exec();

        //return updated course in response
        return res.status(200).json({
            success:true,
            message:"Section Created Successfully",
            updatedCourseDetails,
        })

    } catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error:error.message,
        })
    }
}

//Update a section

exports.updateSection=async (req,res)=>{
    try{
        //data input
        const {sectionName,sectionId}=req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:"Missing Properties",
            });
        }

        //update data
        const section= await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

        //return resposne
        return res.status(200).json({
            success:true,
            message:section,
        })
    } catch(error){
        return res.status(500).json({
            success:false,
            message:"Unable to Update Section, please try again",
            error:error.message,
        })
    }
}

//delete a section

exports.deleteSection=async (req,res)=>{
    try{
            const {sectionId}=req.body;
            //use findByIdAndUpdate
            await Section.findByIdAndUpdate(sectionId);
            //return response
            return res.status(200).json({
                success:true,
                message:"Section Deleted Successfully ",
            })
    } catch(error){
        console.log("Error while deleting section",error);
        return res.status(500).json({
            success:false,
            message:"Unable to delete Section, Please try again",
            error:message.error,
        })
    }
}