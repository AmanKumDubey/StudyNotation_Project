import SubSection from "../models/SubSection";
import Section from "../models/Section";
import {updateImageToCloudinary} from "../utils/imageUploader";

//create a new sub-section for a given section
exports.createSubSection=async(req,res)=>{
    try{
        //fetch data from request of body
        const {sectionId,title,description}=req.body;
        //extract file/video
        
        const video=req.files.videoFile;
        //validation
        if(!sectionId || !title || !description || ! video){
            return res.status(400).json({
                success:false,
                message:"All field are required",
            })
        }
        // upload video file to clouinary
        const uploadDetails=await updateImageToCloudinary(
            video,
            process.env.FOLDER_NAME,
        )

        console.log(uploadDetails);

        //create a sub-section with necessary information
        const subSectionDetails=await SubSection.create({
            title:title,
            timeDuration:`${uploadDetails.duration}`,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })

        //update corresponding section with newly created sub-section
        const updatedSection=await Section.findByIdAndupdate(
            {_id:sectionId},
            {$push:{SubSection:subSectionDetails._id}},
            {new:true}
        ).populate("subSection")

        //return response updated section
        return res.status(200).json({
            success:true,
            message:"Successfull",
            data:updatedSection,
        })
    } catch(error){
        console.error("Error crating a new sub-section: ", error);
        return res.status(500).json({
            succcess: false,
            message: 'Internal Server Error',
            error: error.message,
        })
    }
}

//Update the Sub Section

exports.updateSubSection = async (req, res) => {
    try {
        const {sectionId, title, description} = req.body;
        const subSection = await SubSection.findById(sectionId);

        if(!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found",
            });
        }

        if(title !== undefined) {
            subSection.title = title;
        }

        if(description !== undefined) {
            subSection.description = description;
        }

        if(req.files && req.files.video !== undefined) {
            const video = req.files.video;
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME,
            )
            subSection.videoUrl = uploadDetails.secure_url;
            subSection.timeDuration = `${uploadDetails.duration}`
        }

        await subSection.save();

        return res.json({
            success: true,
            message: "Section updated Successfully"
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section",
        })
    }
};

exports.deleteSubSection = async (req, res) => {
    try {
        const {subSectionId, sectionId} = req.body;
        await Section.findByIdAndUpdate(
            {_id: sectionId},
            {
                $pull: {
                    subSection: subSectionId,
                },
            }
        )
        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId });

        if(!subSection) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: "SubSection Not Found",
                })
        }

        return res.json({
            success: true,
            message: "SubSection Deleted Successfully",
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An Error Occurred While Deleting the SubSection",
        })
    }
}