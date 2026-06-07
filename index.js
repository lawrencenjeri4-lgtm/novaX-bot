const config = require('./config');
const logger = require('./utils/logger');
const connectDB = require('./src/database/mongodb'); // Or './src/database/firebase'
const { loadCommands } = require('./src/handlers/commandHandler');
const startSock = require('./src/core/bot');

const main = async () => {
    // Load configuration
    logger.info(`Starting ${config.botName}...`);

    // Connect to the database
    await connectDB(config.mongoUri);

    // Load all commands
    loadCommands();

    // Start the WhatsApp bot
    try {
        const sock = await startSock();
        logger.info('Bot initiated. Waiting for connection...');

        // Optional: Send a message to owner when bot is ready
        // sock.on('connection.open', async () => {
        //     await sock.sendMessage(config.ownerNumber, { text: `${config.botName} is online and ready!` });
        // });

    } catch (error) {
        logger.error(`Failed to start bot: ${error.message}`);
        process.exit(1);
    }
};

main();
