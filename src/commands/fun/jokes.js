module.exports = {
    name: 'joke',
    description: 'Tells a random joke.',
    category: 'fun',
    settings: {
        cooldown: 10, // seconds
        deleteMessage: true,
        emoji: '😂',
    },
    execute: async (sock, message, args) => {
        const jokes = [
            "Why don't scientists trust atoms? Because they make up everything!",
            "Why did the scarecrow win an award? Because he was outstanding in his field!",
            "I told my wife she was drawing her eyebrows too high. She looked surprised.",
            "What do you call a fish with no eyes? Fsh!",
        ];
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        await sock.sendMessage(message.key.remoteJid, { text: randomJoke }, { quoted: message });
    },
};
