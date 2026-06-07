const config = require('../config');
const { getCommand } = require('./commandHandler');
const logger = require('../utils/logger');
const prefix = config.prefix;

// Basic cooldown map
const cooldowns = new Map();

const handleMessage = async (sock, message) => {
    const messageContent = message.message.extendedTextMessage?.text || message.message.conversation || '';
    const from = message.key.remoteJid;
    const isCmd = messageContent.startsWith(prefix);

    if (!isCmd) return; // Not a command

    const [commandName, ...args] = messageContent.slice(prefix.length).trim().split(/ +/);

    const command = getCommand(commandName);

    if (!command) {
        // Optional: Send a message if command not found
        // await sock.sendMessage(from, { text: `Unknown command: ${prefix}${commandName}` });
        return;
    }

    // --- Cooldown Check ---
    const cooldownKey = `${from}:${message.key.participant || from}:${commandName}`;
    if (cooldowns.has(cooldownKey)) {
        const remaining = (cooldowns.get(cooldownKey) - Date.now()) / 1000;
        if (remaining > 0) {
            return await sock.sendMessage(from, { text: `Please wait ${remaining.toFixed(1)}s before using this command again.` }, { quoted: message });
        }
    }
    cooldowns.set(cooldownKey, Date.now() + command.settings.cooldown * 1000);
    setTimeout(() => cooldowns.delete(cooldownKey), command.settings.cooldown * 1000);

    // --- Permissions/Restrictions ---
    // Placeholder for more complex checks (adminOnly, premiumOnly, groupOnly)
    // You'll need to implement logic to check user roles, subscription status, etc.
    if (command.settings.groupOnly && !from.endsWith('@g.us')) {
        return await sock.sendMessage(from, { text: 'This command can only be used in groups.' }, { quoted: message });
    }
    if (command.settings.adminOnly && message.key.participant !== config.ownerNumber && !message.key.participant.endsWith('@s.whatsapp.net')) {
        // Basic check, needs more robust admin role checking in groups
        return await sock.sendMessage(from, { text: 'This command is for administrators only.' }, { quoted: message });
    }

    // --- Execute Command ---
    try {
        logger.info(`Executing command: ${prefix}${commandName} from ${message.key.participant || from}`);
        await command.execute(sock, message, args);

        // Optional: Delete user's command message
        if (command.settings.deleteMessage) {
            await sock.sendMessage(from, { delete: message.key });
        }
    } catch (error) {
        logger.error(`Error executing command ${prefix}${commandName}: ${error.message}`);
        await sock.sendMessage(from, { text: `An error occurred while executing the command. Please try again later.` }, { quoted: message });
    }
};

module.exports = handleMessage;
