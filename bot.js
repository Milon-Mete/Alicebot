require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const express = require('express');

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userMessage = msg.text;

    if (!userMessage) return;
    bot.sendMessage(chatId, "🤖 Thinking...");

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
            { contents: [{ role: "user", parts: [{ text: userMessage }] }] }
        );

        const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "❌ No response.";
        bot.sendMessage(chatId, reply);
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        bot.sendMessage(chatId, `❌ API Error: ${error.response?.data?.error?.message || "Check logs for details"}`);
    }
});

// 🔹 Fake Express server to keep Render Web Service alive
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Bot is running...");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

console.log("🤖 Telegram bot is running...");
