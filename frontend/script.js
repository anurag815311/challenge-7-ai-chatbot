
// Full conversation history
const messages = [];

// DOM elements
const chatDisplay = document.getElementById('chatDisplay');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

// Backend URL
const API_URL = 'http://localhost:3000/chat';

// Render message
function renderMessage(role, content) {
    const messageDiv = document.createElement('div');

    messageDiv.classList.add('message', role);
    messageDiv.textContent = content;

    chatDisplay.appendChild(messageDiv);

    // Scroll to latest message
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');

    errorDiv.classList.add('message', 'error');
    errorDiv.textContent = message;

    chatDisplay.appendChild(errorDiv);
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

// Send message to backend
async function sendMessage() {
    const text = messageInput.value.trim();

    if (!text) return;

    // Prevent multiple simultaneous requests
    if (sendBtn.disabled) return;

    // Add user message to conversation history
    messages.push({
        role: 'user',
        content: text
    });

    // Display user message
    renderMessage('user', text);

    // Clear input
    messageInput.value = '';

    // Disable button while waiting
    sendBtn.disabled = true;
    sendBtn.textContent = 'Thinking...';

    try {
        // Send complete conversation history
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: messages
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Unable to get AI response.');
        }

        // Save AI response to conversation history
        messages.push({
            role: 'assistant',
            content: data.reply
        });

        // Display AI response
        renderMessage('assistant', data.reply);

    } catch (error) {
        console.error('Chat error:', error);

        showError(error.message || 'Something went wrong. Please try again.');

        // Remove failed user message from history
        messages.pop();

    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send';
        messageInput.focus();
    }
}

// Send button event
sendBtn.addEventListener('click', sendMessage);

// Enter key event
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});
