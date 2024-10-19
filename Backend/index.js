import express from "express";
import dotenv from "dotenv";
import connect   from "./config/database.js";
dotenv.config();

const app=express();

connect();
app.listen(3000,()=>{
    console.log("App is listining at 3000");
})

