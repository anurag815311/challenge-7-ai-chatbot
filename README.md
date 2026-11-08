# 🤖 AI Chatbot — Build and Deploy Your First AI Chatbot

A full-stack AI chatbot built using **HTML, CSS, JavaScript, Node.js, Express, and OpenRouter**. It allows users to interact with an AI assistant through a web interface, receive AI-generated responses, and maintain conversation context throughout a session.

The application follows a secure client-server architecture: the frontend communicates with the Express backend, while the backend handles AI requests and keeps API credentials server-side.

## 🌐 Live Deployment

| Resource | Link |
|---|---|
| Live Frontend | https://beautiful-daffodil-637bc9.netlify.app |
| Live Backend | https://challenge-7-ai-chatbot.onrender.com |

| GitHub Repository | https://github.com/anurag815311/challenge-7-ai-chatbot |
| Pull Request | https://github.com/anurag815311/challenge-7-ai-chatbot/pull/1 |


## 📌 What I Built

I built a minimal, functional AI chatbot with:

- A frontend chat interface with a message input and send button.
- A Node.js and Express backend with a `/chat` API endpoint.
- OpenRouter integration for generating AI responses.
- Conversation history maintained in a frontend JavaScript array.
- Input validation and error handling on the backend.
- Environment-based API key management.
- Separate frontend and backend deployments using Netlify and Render.

## 🤖 API and Model

**Question 1: Which API and model did I use?**

- **AI Provider:** OpenRouter
- **API:** OpenRouter Chat Completions API
- **API Endpoint:** `https://openrouter.ai/api/v1/chat/completions`
- **Model Configuration:** `openrouter/free`

The application uses the `openrouter/free` router, which automatically selects an available supported free model. Therefore, the exact underlying model may vary between requests.

The backend forwards the complete conversation history to OpenRouter and returns the generated response to the frontend.

### Why OpenRouter?

- One API key provides access to multiple AI models.
- It offers an OpenAI-compatible API structure.
- It supports multiple model providers.
- Models can be changed without redesigning the entire frontend.

Official resources:

- [OpenRouter](https://openrouter.ai/)
- [API Documentation](https://openrouter.ai/docs)
- [Free Models](https://openrouter.ai/collections/free-models)

## 🔐 Why Is the API Call Made From the Backend?

**Question 2: Why did I use the backend instead of calling the AI API directly from the frontend?**

API keys placed in frontend JavaScript can be inspected through browser DevTools, source code, and network requests. Anyone could extract the key and use it for unauthorized API requests, potentially consuming credits or generating unexpected costs.

To prevent this, the frontend communicates only with the Express backend. The backend reads `OPENROUTER_API_KEY` from environment variables and attaches it to requests sent to OpenRouter.

The API key is never included in frontend code or sent to the browser.

### Environment Variables

Create `backend/.env` for local development:

```env
OPENROUTER_API_KEY=your-actual-api-key
PORT=3000
```

The `.env` file is excluded through `.gitignore` and must never be committed to GitHub.

The committed `backend/.env.example` contains placeholders:

```env
OPENROUTER_API_KEY=your-openrouter-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here
PORT=3000
```

For production, configure `OPENROUTER_API_KEY` through the Render dashboard's environment variables.

The backend accesses the key using:

```javascript
const apiKey = process.env.OPENROUTER_API_KEY;
```

## 🔄 Conversation Context Management

The chatbot maintains conversation history using a JavaScript array.

For example:

```javascript
const messages = [
    {
        role: "user",
        content: "What is JavaScript?"
    },
    {
        role: "assistant",
        content: "JavaScript is a programming language used for web development."
    },
    {
        role: "user",
        content: "Can you give me an example of that?"
    }
];
```

Every time the user sends a message:

1. The frontend adds the user's message to the `messages` array.
2. It sends the complete array to the backend.
3. The backend forwards the conversation history to OpenRouter.
4. The AI generates a response using the previous messages as context.
5. The frontend adds the assistant's response to the array and displays it.

This allows the chatbot to understand follow-up questions instead of treating every message as a completely new conversation.

## 🏗️ System Architecture

```text
             USER
               |
               v
      FRONTEND (HTML/CSS/JS)
               |
               | POST /chat
               | Full conversation history
               v
        NODE.JS + EXPRESS
               |
               | Read API key from environment
               v
            OPENROUTER
               |
               v
          AVAILABLE AI MODEL
               |
               v
        AI-GENERATED RESPONSE
               |
               v
        EXPRESS BACKEND
               |
               v
         FRONTEND CHAT UI
               |
               v
              USER
```

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Chat interface structure |
| CSS3 | Styling and layout |
| JavaScript | Frontend functionality and conversation history |
| Node.js | Backend runtime |
| Express.js | REST API development |
| OpenRouter | AI model integration |
| node-fetch | HTTP requests to OpenRouter |
| dotenv | Environment variable management |
| CORS | Cross-origin communication |
| Git & GitHub | Version control |
| Render | Backend deployment |
| Netlify | Frontend deployment |

## 📂 Project Structure

```text
challenge-7-ai-chatbot/
│
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Local Setup

### Prerequisites

- Node.js
- npm
- Git
- An OpenRouter account and API key

### 1. Clone the repository

```bash
git clone https://github.com/anurag815311/challenge-7-ai-chatbot.git
```

### 2. Navigate to the project

```bash
cd challenge-7-ai-chatbot
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `backend` directory:

```env
OPENROUTER_API_KEY=your-actual-api-key
PORT=3000
```

### 5. Start the backend

```bash
npm start
```

Expected output:

```text
Server is running on port 3000
```

### 6. Open the frontend

Open `frontend/index.html` using Visual Studio Code Live Server.

For local development, configure the frontend API URL as:

```javascript
const API_URL = 'http://localhost:3000/chat';
```

For the deployed frontend, use the Render backend URL:

```javascript
const API_URL = 'https://challenge-7-ai-chatbot.onrender.com/chat';
```

## 🧪 Testing

The following scenarios are relevant to testing the application:

| Test Case | Expected Result |
|---|---|
| Backend health check | Returns HTTP 200 |
| Send a message | AI generates a response |
| Empty message | Message is not submitted |
| Follow-up question | AI understands previous context |
| Missing API key | Backend returns an error |
| Invalid message format | Backend returns HTTP 400 |
| OpenRouter API failure | Backend returns an appropriate error |

### Health Check

```http
GET /health
```

Expected response:

```json
{
    "status": "ok",
    "message": "AI Chatbot backend is running!"
}
```

### Chat Endpoint

```http
POST /chat
```

Request body:

```json
{
    "messages": [
        {
            "role": "user",
            "content": "What is JavaScript?"
        }
    ]
}
```

Expected response structure:

```json
{
    "reply": "JavaScript is a programming language..."
}
```

## 🚀 Deployment

The application uses separate hosting platforms for the frontend and backend.

### Backend Deployment — Render

**Live Backend:** https://challenge-7-ai-chatbot.onrender.com

Deployment configuration:

| Setting | Value |
|---|---|
| Platform | Render |
| Service Type | Web Service |
| Runtime | Node.js |
| Repository | challenge-7-ai-chatbot |
| Branch | feature/ai-chatbot |
| Build Command | `cd backend && npm install` |
| Start Command | `cd backend && npm start` |

Configure `OPENROUTER_API_KEY` in the Render environment variables dashboard.

### Frontend Deployment — Netlify

**Live Frontend:** https://beautiful-daffodil-637bc9.netlify.app

The frontend is deployed using Netlify. Its API configuration points to the deployed Render backend:

```javascript
const API_URL = 'https://challenge-7-ai-chatbot.onrender.com/chat';
```

The frontend sends requests to this backend endpoint rather than calling OpenRouter directly.


Note: Render's free services may spin down after inactivity, so the first request after an idle period can take longer.

## 🔁 Fallback AI Provider — Google Gemini

**Question 3: Which provider would I use if OpenRouter becomes unavailable or free models are no longer accessible?**

I would use the **Google Gemini API** as the fallback provider.

Official resources:

- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs)

To switch to Gemini using its OpenAI-compatible endpoint, two changes are required:

**1. Change the API base URL**

```text
https://generativelanguage.googleapis.com/v1beta/openai/
```

**2. Change the model name**

```javascript
model: 'gemini-2.5-flash'
```

The model name is subject to current Gemini API availability. The backend request structure can remain largely the same.

A Gemini API key must also be configured securely in the backend environment. It must never be exposed in frontend JavaScript.

## 🌱 Git Workflow

The project follows a feature-branch workflow.

**Main branch:** `main`

Contains the initial starter project.

**Feature branch:** `feature/ai-chatbot`

Contains the chatbot implementation.

### Create a feature branch

```bash
git checkout -b feature/ai-chatbot
```

### Stage and commit changes

```bash
git add .
git commit -m "feat: implement AI chatbot with OpenRouter integration and conversation context"
```

### Push changes

```bash
git push origin feature/ai-chatbot
```

### Pull Request

- **Base branch:** `main`
- **Compare branch:** `feature/ai-chatbot`

[View Pull Request #1](https://github.com/anurag815311/challenge-7-ai-chatbot/pull/1)

## 🎥 Project Walkthrough

The walkthrough demonstrates the chatbot's functionality, contextual conversation, backend API-key handling, and project README.



## 🔮 Future Improvements

- Streaming AI responses.
- Markdown rendering for AI responses.
- Chat session management.
- Conversation export.
- Clear conversation functionality.
- Multiple AI model selection.
- Improved mobile responsiveness.
- Rate limiting and request throttling.
- Authentication and user-specific chat history.

## 👨‍💻 Author

**Anurag Kumar Singh**

GitHub: [anurag815311](https://github.com/anurag815311)

## 📄 Assignment Information

**Challenge #7 — Build and Deploy Your First AI Chatbot**

Project Engineering — Kalvium

This project demonstrates full-stack development, REST API integration, environment variable management, AI model integration, conversation context handling, Git version control, and cloud deployment.