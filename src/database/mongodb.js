const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        logger.info('MongoDB connected successfully');
    } catch (error) {
        logger.error(`MongoDB connection error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
