import mongoose from "mongoose";

export default async function dbMain(){
    await  mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log('connected to MongoDB');
}