# NovaX Bot

A highly advanced, multifunctional WhatsApp bot designed for entertainment, utility, automation, downloads, AI interaction, and group management.

## Features

*   **500+ Commands:** Organized into 10+ categories.
*   **Modular Architecture:** Plugin-based structure for easy expansion.
*   **AI Integration:** ChatGPT-like chat, image generation, story writing, etc.
*   **Download Capabilities:** YouTube, TikTok, Instagram, Facebook, Spotify.
*   **Group Management:** Kick, ban, mute, anti-link, anti-spam, welcome/goodbye messages.
*   **User System:** XP leveling, ranks, wallet, achievements.
*   **Utilities:** Weather, calculator, QR generator, URL shortener, etc.
*   **Media & Music:** Play music, lyrics finder, audio converter.
*   **Premium System:** Subscription tiers for advanced features.
*   **System Core:** Uptime, ping, auto-reconnect, multi-session support.
*   **Fast Response:** Target <1s response time.
*   **Deployment Ready:** Supports Render, Railway, VPS.

## Stack

*   **Language:** Node.js (latest LTS)
*   **WhatsApp Library:** Baileys (`@whiskeysockets/baileys`)
*   **Database:** MongoDB (or Firebase)
*   **Hosting:** Render / Railway / VPS

## Setup

### Prerequisites

1.  **Node.js:** Install the latest LTS version from [nodejs.org](https://nodejs.org/).
2.  **MongoDB:**
    *   **Local:** Install MongoDB Community Server.
    *   **Cloud:** Sign up for a free tier on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas). Get your connection string (URI).
3.  **API Keys (Optional):**
    *   OpenWeatherMap API key (for weather command). Sign up at [openweathermap.org](https://openweathermap.org/).
    *   (Add others for AI, etc. as you implement them)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd novaX-bot
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create `.env` file:**
    Copy the example `.env.example` (if you create one) or create a new `.env` file in the root directory and add your configurations:

    ```env
    # MongoDB Connection String
    MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/novaXBot?retryWrites=true&w=majority
    # Or for local: MONGO_URI=mongodb://localhost:27017/novaXBot

    # Bot Prefix (e.g., ., !, /)
    BOT_PREFIX=.

    # Your WhatsApp number in jid format (e.g., 1234567890@s.whatsapp.net)
    OWNER_NUMBER=1234567890@s.whatsapp.net

    # API Keys
    WEATHER_API_KEY=YOUR_OPENWEATHERMAP_API_KEY
    # OPENAI_API_KEY=YOUR_OPENAI_API_KEY
    # ... other API keys
    ```

4.  **Run the bot:**
    ```bash
    node index.js
    ```
5.  **Scan QR Code:** A QR code will appear in your terminal. Scan it using your WhatsApp app (Settings > Linked Devices > Link a Device).

### Deployment

**Render / Railway:**
*   Ensure your project is pushed to a Git repository (GitHub, GitLab).
*   Connect your repository to Render/Railway.
*   Configure environment variables in the platform's settings based on your `.env` file.
*   Set the start command to `node index.js`.

**VPS:**
*   Install Node.js and MongoDB on your server.
*   Clone the repository and follow the setup steps.
*   Use a process manager like `pm2` to keep the bot running:
    ```bash
    sudo npm install pm2 -g
    pm2 start index.js --name "novaX-bot"
    pm2 startup # Follow instructions to enable auto-start on reboot
    pm2 save
    ```

---

**Note:** This is a foundational structure. You will need to implement the logic for each command, database interactions for user data, advanced permission systems, and error handling for all features.
