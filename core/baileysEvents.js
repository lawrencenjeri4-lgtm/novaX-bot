const { proto, getContentType } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const logger = require('../utils/logger');
const handleMessage = require('../handlers/messageHandler');
const config = require('../config');

const sockEvents = (sock) => {
    // Handle connection events
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            qrcode.generate(qr, { small: true });
            logger.info('QR code generated. Please scan it to connect your WhatsApp.');
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== 500 &&
                                    lastDisconnect.error?.output?.statusCode !== 401 &&
                                    lastDisconnect.error?.output?.statusCode !== 403;
            logger.warn(`Connection closed. Reconnecting: ${shouldReconnect}`);

            if (shouldReconnect) {
                // Implement your session saving/loading logic here
                // For now, it will prompt for QR again if session is lost.
                logger.info('Attempting to reconnect...');
                // You might need to re-initialize the connection logic here
                // await startSock(); // Assuming startSock is your main Baileys init function
            } else {
                logger.info('Connection closed due to critical error. Please re-pair the device.');
                // Optionally clear session files
            }
        } else if (connection === 'open') {
            logger.info('WhatsApp connection opened.');
            // Optionally send a message to owner upon successful connection
            // await sock.sendMessage(config.ownerNumber, { text: `${config.botName} is online!` });
        }
    });

    // Handle messages
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const message of messages) {
            if (!message.key.fromMe && message.message) {
                try {
                    // Log incoming message for debugging
                    // logger.debug(`Received message: ${JSON.stringify(message)}`);

                    // Basic message processing (e.g., text messages)
                    const messageType = getContentType(message.message);
                    if (messageType === 'extendedTextMessage' || messageType === 'conversation') {
                         // Ensure we have a valid message object before proceeding
                        if (message.message && (message.message.extendedTextMessage || message.message.conversation)) {
                            await handleMessage(sock, message);
                        }
                    } else {
                        // Handle other message types if needed (image, audio, etc.)
                        // logger.info(`Received non-text message type: ${messageType}`);
                    }
                } catch (error) {
                    logger.error(`Error processing message: ${error.message}`);
                }
            }
        }
    });

    // Handle group updates (participants joining/leaving, etc.)
    sock.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update;
        logger.info(`Group participants update in ${id}: ${action} - ${participants.join(', ')}`);

        // TODO: Implement welcome/goodbye messages based on 'action' (add, remove, promote, demote)
        // You'll need to fetch group metadata and user info for richer messages.
        if (action === 'add') {
            // Example: Send welcome message
            // const groupMetadata = await sock.groupMetadata(id);
            // const welcomeMsg = `Welcome to ${groupMetadata.subject}, @${participants[0].split('@')[0]}!`;
            // await sock.sendMessage(id, { text: welcomeMsg, mentions: participants });
        }
        if (action === 'remove') {
            // Example: Send goodbye message
            // const goodbyeMsg = `Goodbye, @${participants[0].split('@')[0]}!`;
            // await sock.sendMessage(id, { text: goodbyeMsg, mentions: participants });
        }
    });

    // Add other event handlers as needed (e.g., messages.update for status, read receipts)
};

module.exports = sockEvents;
