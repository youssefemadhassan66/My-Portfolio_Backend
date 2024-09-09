require('dotenv').config();
const mongoose = require('mongoose');

const ConnectionDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Database is connected');
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

module.exports = ConnectionDB;
