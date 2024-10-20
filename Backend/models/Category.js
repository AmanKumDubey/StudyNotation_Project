import mongoose from "mongoose";
const categorySchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Course"
    }

});
module.exports=mongoose.model("Category",categorySchema);