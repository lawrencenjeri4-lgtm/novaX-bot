const axios = require('axios');
const config = require('../../config');

module.exports = {
    name: 'weather',
    description: 'Get weather information for a location.',
    category: 'utilities',
    settings: {
        cooldown: 30,
        deleteMessage: true,
        emoji: '☀️',
    },
    execute: async (sock, message, args) => {
        const location = args.join(' ');
        if (!location) {
            return await sock.sendMessage(message.key.remoteJid, { text: 'Please provide a location. Example: `.weather New York`' }, { quoted: message });
        }

        try {
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(location)}&appid=${config.weatherApiKey}&units=metric`);
            const data = response.data;

            const weatherDescription = data.weather[0].description;
            const temp = data.main.temp;
            const feelsLike = data.main.feels_like;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;

            const weatherMessage = `*Weather in ${data.name}, ${data.sys.country}*\n`
                                 + `Description: ${weatherDescription.charAt(0).toUpperCase() + weatherDescription.slice(1)}\n`
                                 + `Temperature: ${temp}°C\n`
                                 + `Feels like: ${feelsLike}°C\n`
                                 + `Humidity: ${humidity}%\n`
                                 + `Wind Speed: ${windSpeed} m/s`;

            await sock.sendMessage(message.key.remoteJid, { text: weatherMessage }, { quoted: message });
        } catch (error) {
            if (error.response && error.response.status === 404) {
                await sock.sendMessage(message.key.remoteJid, { text: `Location "${location}" not found.` }, { quoted: message });
            } else {
                console.error('Weather API error:', error.message);
                await sock.sendMessage(message.key.remoteJid, { text: 'Failed to fetch weather information. Please try again later.' }, { quoted: message });
            }
        }
    },
};
