require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Initialize Telegram bot
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const userMessage = msg.text;

    if (!userMessage) return;

    bot.sendMessage(chatId, "🤖 Thinking...");

    try {
        // Send request to Gemini 1.5 API
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ role: "user", parts: [{ text: userMessage }] }]
            }
        );

        // Extract AI response
        const reply = response.data.candidates?.[0]?.content?.parts?.[0]?.text || "❌ Error: No response from AI.";

        bot.sendMessage(chatId, reply);
    } catch (error) {
        console.error("Error:", error.response?.data || error.message);
        bot.sendMessage(chatId, `❌ API Error: ${error.response?.data?.error?.message || "Check logs for details"}`);
    }
});

console.log("🤖 Telegram bot is running...");
