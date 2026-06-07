const fs = require('fs');
const path = require('path');
const config = require('../config');
const logger = require('../utils/logger');
const defaultSettings = require('../config/default_settings');

const commands = new Map();
const categories = new Map();

const loadCommands = () => {
    const commandDir = path.join(__dirname, '../commands');

    fs.readdirSync(commandDir).forEach(categoryDir => {
        const categoryPath = path.join(commandDir, categoryDir);
        const categoryStat = fs.statSync(categoryPath);

        if (categoryStat.isDirectory()) {
            const categoryName = categoryDir.charAt(0).toUpperCase() + categoryDir.slice(1); // e.g., "Fun", "Games"
            categories.set(categoryName.toLowerCase(), {
                name: categoryName,
                emoji: defaultSettings.defaultCategorySettings.emoji,
                description: defaultSettings.defaultCategorySettings.description,
                commands: [],
            });

            fs.readdirSync(categoryPath).forEach(commandFile => {
                if (commandFile.endsWith('.js')) {
                    const commandPath = path.join(categoryPath, commandFile);
                    try {
                        const command = require(commandPath);
                        const commandName = commandFile.replace('.js', '').toLowerCase();

                        if (command.name && command.execute) {
                            commands.set(commandName, {
                                ...command,
                                category: categoryName.toLowerCase(),
                                settings: { ...defaultSettings.defaultCommandSettings, ...command.settings },
                            });
                            categories.get(categoryName.toLowerCase()).commands.push(commandName);
                            logger.info(`Loaded command: ${categoryName}/${commandName}`);
                        } else {
                            logger.warn(`Skipping invalid command file: ${commandPath} (missing name or execute function)`);
                        }
                    } catch (error) {
                        logger.error(`Error loading command ${commandFile}: ${error.message}`);
                    }
                }
            });
        }
    });
    logger.info(`Loaded ${commands.size} commands across ${categories.size} categories.`);
};

const getCommand = (commandName) => {
    return commands.get(commandName.toLowerCase());
};

const getAllCommands = () => {
    return commands;
};

const getAllCategories = () => {
    return categories;
};

module.exports = {
    loadCommands,
    getCommand,
    getAllCommands,
    getAllCategories,
    commands, // Exporting for direct use if needed by messageHandler
    categories,
};
