import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB=async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Mongodb Connected Successfully");
    }
    catch(err)
    {
        console.error("Error connecting to MongoDB:", err);
    }
}

export default connectDB;