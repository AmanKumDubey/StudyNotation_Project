import mongoose from "mongoose";
import dotenv from "dotenv"


dotenv.config()

exports.connect= ()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })

    .then(()=>{
        console.log("DATABSE CONNECTION SUCCESSFULLY");
    })
    .catch((error)=>{
        console.log("DATABASE CONNECTION FAILED !");
        console.error(error);
        process.exit(1);
    })
};