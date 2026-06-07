module.exports = {
    // Default settings for commands, e.g., cooldown, groupOnly, etc.
    defaultCommandSettings: {
        cooldown: 5, // seconds
        groupOnly: false,
        adminOnly: false,
        premiumOnly: false,
        deleteMessage: false, // Whether to delete the user's command message
    },
    // Default settings for categories
    defaultCategorySettings: {
        description: 'No description provided.',
        emoji: '✨',
    },
};
