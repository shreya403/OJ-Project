const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const DBConnection = async () =>{
    const MONGO_URL = process.env.MONGO_URL;
    try{
        await mongoose.connect(MONGO_URL);
        console.log('DB connection established');
    }
    catch(error){
        console.log('Error connecting to MongoDB' + error);
    }
};

module.exports = {DBConnection};