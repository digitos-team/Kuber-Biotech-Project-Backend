import mongoose from "mongoose";
import { DB_Name } from "../constant.js"

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.appName
        })
        console.log(`Database Connected To ${process.env.appName} hosted by ${connectionInstance.connection.host}`);
    } catch (err) {
        console.log("MongoDB connection error: ", err);
        process.exit(1)
    }
}
