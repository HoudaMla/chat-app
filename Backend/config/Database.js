const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Successfully Connected to DB");
    } catch (error) {
        console.error("Error Connecting to DB:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
