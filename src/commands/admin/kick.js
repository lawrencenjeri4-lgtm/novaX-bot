module.exports = {
    name: 'kick',
    description: 'Kick a user from the group.',
    category: 'admin',
    settings: {
        groupOnly: true,
        adminOnly: true,
        deleteMessage: true,
        emoji: '👋',
    },
    execute: async (sock, message, args) => {
        const jid = message.key.remoteJid;
        const participants = message.key.participant; // Sender of the command

        // Basic check if the command is used in a group
        if (!jid.endsWith('@g.us')) {
            return await sock.sendMessage(jid, { text: 'This command can only be used in groups.' }, { quoted: message });
        }

        // TODO: Implement a robust admin check for the sender.
        // Baileys doesn't directly provide a "isAdmin" flag. You'd need to fetch group metadata
        // and check if the sender's JID is in the admin list.
        // For now, relying on the general adminOnly flag which is a placeholder.

        let targetUser = message.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        if (!targetUser) {
            // Try to find user from the message body if not mentioned
            const userAlias = args[0]; // Might be a name or number
            if (userAlias) {
                try {
                    // Attempt to resolve from participants if it's a number
                    if (userAlias.endsWith('@s.whatsapp.net')) {
                        targetUser = userAlias;
                    } else {
                         // Find participant by name/number partial match (this can be unreliable)
                         const groupMetadata = await sock.groupMetadata(jid);
                         const foundParticipant = groupMetadata.participants.find(p =>
                            p.id.includes(userAlias) || p.name?.toLowerCase().includes(userAlias.toLowerCase())
                        );
                        if (foundParticipant) {
                            targetUser = foundParticipant.id;
                        }
                    }
                } catch (error) {
                    console.error("Error resolving user:", error);
                }
            }
        }

        if (!targetUser) {
            return await sock.sendMessage(jid, { text: 'Please mention the user you want to kick or provide their number/alias.' }, { quoted: message });
        }

        // Prevent kicking self or owner
        if (targetUser === participants || targetUser === config.ownerNumber) {
            return await sock.sendMessage(jid, { text: 'You cannot kick yourself or the owner.' }, { quoted: message });
        }

        try {
            await sock.groupParticipantsUpdate(jid, [targetUser], 'remove');
            await sock.sendMessage(jid, { text: `@${targetUser.split('@')[0]} has been kicked.`, mentions: [targetUser] }, { quoted: message });
        } catch (error) {
            console.error("Kick error:", error);
            if (error.message.includes('admin required')) {
                await sock.sendMessage(jid, { text: 'I need to be an admin to kick users.' }, { quoted: message });
            } else {
                await sock.sendMessage(jid, { text: `Failed to kick ${targetUser}. Ensure I am an admin and the user is in the group.` }, { quoted: message });
            }
        }
    },
};
