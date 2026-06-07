const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require('@whiskeysockets/baileys');
const logger = require('../utils/logger');
const config = require('../config');
const sockEvents = require('./baileysEvents');

// Function to start the Baileys socket
const startSock = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('baileys_session'); // Saves session in 'baileys_session' folder

    const sock = makeWASocket({
        auth: state,
        logger: logger, // Use pino logger
        browserDescription: [config.botName, 'Chrome', '110.0.0.0'], // Customize user agent
        patchMobileApi: true, // Use mobile API
        markOnlineOnConnect: true, // Mark as online when connected
        // mobile: { // Optional: for mobile login if needed
        //   version: [6, 96, 5],
        //   auth: state,
        //   logger: logger,
        // },
    });

    // Save credentials whenever they change
    sock.ev.on('creds.update', saveCreds);

    // Handle Baileys events
    sockEvents(sock);

    return sock;
};

module.exports = startSock;
