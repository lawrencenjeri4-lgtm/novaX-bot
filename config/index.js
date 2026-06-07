require('dotenv').config();

module.exports = {
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/novaXBot',
    prefix: process.env.BOT_PREFIX || '.', // Default prefix
    botName: 'NovaX Bot',
    ownerNumber: process.env.OWNER_NUMBER || 'YOUR_OWNER_NUMBER', // Your WhatsApp number
    // Add other configurations as needed
};
