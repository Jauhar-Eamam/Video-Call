
import mongoose  from 'mongoose';

async function connectDB() {
    try{
        await mongoose.connect(process.env.MONGO_SECRET);
        console.log("Connecting to Db succesfully")
    } catch(err){
        console.log("Error in connecting to DB");  
        console.log(err);
         
    }
}


export default connectDB;