
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'AI Chatbot backend is running!'
    });
});

// AI Chat Route
app.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        // Validate messages
        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({
                error: 'Please provide a valid messages array.'
            });
        }

        // Validate message structure
        const isValid = messages.every(message =>
            message &&
            ['user', 'assistant'].includes(message.role) &&
            typeof message.content === 'string' &&
            message.content.trim().length > 0
        );

        if (!isValid) {
            return res.status(400).json({
                error: 'Invalid message format.'
            });
        }

        // Get API key from environment
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            return res.status(500).json({
                error: 'OpenRouter API key is missing.'
            });
        }

        // Call OpenRouter API
        const response = await fetch(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'http://localhost:3000',
                    'X-Title': 'Challenge 7 AI Chatbot'
                },
                body: JSON.stringify({
                    model: 'openrouter/free',
                    messages: messages
                })
            }
        );

        const data = await response.json();

        // Handle API errors
        if (!response.ok) {
            console.error('OpenRouter API error:', data);

            return res.status(response.status).json({
                error: data.error?.message || 'AI service request failed.'
            });
        }

        // Extract AI response
        const reply = data.choices?.[0]?.message?.content;

        if (!reply) {
            return res.status(502).json({
                error: 'The AI returned an empty response.'
            });
        }

        // Send response to frontend
        return res.status(200).json({
            reply: reply
        });

    } catch (error) {
        console.error('Server error:', error);

        return res.status(500).json({
            error: 'Something went wrong. Please try again.'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
