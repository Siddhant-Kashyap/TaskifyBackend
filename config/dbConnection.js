const mongoose = require("mongoose")

const MONGO_URI = "mongodb+srv://admin:admin@cluster0.bhl4nfd.mongodb.net/?retryWrites=true&w=majority"

const connectDb=async()=>{
    try{
        await mongoose.connect(MONGO_URI).then(()=>{
            console.log("Connected to mongo ");
        })

    }catch(e){
        console.log(e);
    }

}

module.exports = connectDb;

