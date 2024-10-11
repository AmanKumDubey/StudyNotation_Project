import mongoose from "mongoose";

const ratingAndReviiewScheam=new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"user",
    },
    rating:{
        Type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
    }
    
});

module.exports=mongoose.model("RatingAndReviiew",ratingAndReviiewScheam);