import mongoose from "mongoose";
import dotenv from "dotenv"


dotenv.config()

const connect= ()=>{
    mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost:27017/yours",{
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

export default connect;