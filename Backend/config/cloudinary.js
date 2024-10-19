import cloudinary from "cloudinary";
import dotenv from "dotenv";

cloudinary.v2

exports.cloudinaryConnect=()=>{
    try{
        cloudinary.config({
            //configuring the cloudinary to upload MEDIA
            cloud_name:process.env.CLOUD_NAME,
            api_key:process.env.CLOUD_API_KEY,
            api_secret:process.env.API_SECRET,
        })
    } catch(error){
        console.log(error);
    }
}
