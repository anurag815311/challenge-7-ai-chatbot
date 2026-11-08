# 🤖 AI Chatbot — Build and Deploy Your First AI Chatbot

A full-stack AI chatbot built using **HTML, CSS, JavaScript, Node.js, Express, and OpenRouter**. The application allows users to interact with an AI assistant, receive intelligent responses, and maintain conversation context throughout a session.

The project follows a secure backend architecture where API credentials are stored in environment variables and never exposed to the frontend.

---

## 🌐 Live Demo

| Resource | Link |
|---|---|
| Live Frontend | `https://beautiful-daffodil-637bc9.netlify.app` |
| Live Backend | `https://challenge-7-ai-chatbot.onrender.com/` |
| GitHub Repository | https://github.com/anurag815311/challenge-7-ai-chatbot |
| Pull Request | Add your PR URL here |

> Deployment URLs will be updated after successful deployment.

---

## 📌 Project Overview

The objective of this project is to build and deploy a functional AI chatbot with a frontend interface and a backend API that communicates with an AI model.

Users can:
- Enter questions and receive AI-generated responses.
- Continue conversations with contextual understanding.
- Ask follow-up questions based on previous responses.
- Interact through a simple chat interface.

### Key Features

- **AI Integration:** Uses OpenRouter to access AI language models.
- **Conversation Context:** Maintains complete conversation history.
- **Secure API Integration:** Keeps API credentials on the backend.
- **REST API:** Uses an Express `/chat` endpoint.
- **Input Validation:** Validates incoming messages.
- **Error Handling:** Handles invalid requests and AI API failures.
- **Health Check:** Provides a backend health-check endpoint.
- **Responsive Interface:** Provides a simple chat interface for interaction.

---

## 🏗️ System Architecture

The application follows a client-server architecture.

```text
                 USER
                   |
                   |
                   v
          FRONTEND (HTML/CSS/JS)
                   |
                   |
              POST /chat
                   |
                   v
          NODE.JS + EXPRESS
                   |
                   |
          Read API Key from .env
                   |
                   v
              OPENROUTER
                   |
                   |
              AI MODEL
                   |
                   v
          AI GENERATED RESPONSE
                   |
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

### Request Flow

1. The user enters a message in the frontend.
2. JavaScript adds the message to the conversation history.
3. The frontend sends the complete conversation history to the backend.
4. Express receives the request through `/chat`.
5. The backend reads the API key from environment variables.
6. The backend sends the conversation to OpenRouter.
7. OpenRouter processes the request using an available free model.
8. The backend extracts the AI-generated response.
9. The response is returned to the frontend and displayed in the chat interface.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Chat interface structure |
| CSS3 | Styling and layout |
| JavaScript | Frontend functionality |
| Node.js | Backend runtime |
| Express.js | REST API development |
| OpenRouter | AI model integration |
| node-fetch | HTTP requests to OpenRouter |
| dotenv | Environment variable management |
| CORS | Cross-origin communication |
| Git & GitHub | Version control |
| Render | Backend deployment |
| Netlify | Frontend deployment |

---

## 🤖 API and Model Information

**AI Provider:** OpenRouter

**API Endpoint:**

```text
https://openrouter.ai/api/v1/chat/completions
```

**Model Configuration:**

```javascript
model: 'openrouter/free'
```

The `openrouter/free` router automatically selects an available free model for the request.

This allows the application to use supported free models without hardcoding a specific model provider.

### Why OpenRouter?

- One API key provides access to multiple AI models.
- Uses an OpenAI-compatible API structure.
- Supports multiple model providers.
- Allows switching between models without redesigning the backend integration.

Official resources:

- OpenRouter: https://openrouter.ai/
- API Documentation: https://openrouter.ai/docs
- Free Models: https://openrouter.ai/collections/free-models
- API Keys: https://openrouter.ai/keys

---

## 🔐 Security Implementation

The API key is never exposed in frontend JavaScript.

The backend reads the API key through:

```javascript
const apiKey = process.env.OPENROUTER_API_KEY;
```

The key is stored in:

```text
backend/.env
```

### Why is the API call made from the backend?

If an API key is included directly in frontend JavaScript, anyone can inspect the browser's source code or network requests and extract the key.

This can lead to unauthorized API usage and unexpected costs.

To prevent this, the frontend communicates only with our Express backend. The backend securely attaches the API key when communicating with OpenRouter.

### Environment Variables

Create `backend/.env`:

```env
OPENROUTER_API_KEY=your-actual-api-key
PORT=3000
```

The `.env` file must never be committed to GitHub.

Create `backend/.env.example`:

```env
OPENROUTER_API_KEY=your-openrouter-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here
PORT=3000
```

---

## 💬 Conversation Context Management

The application maintains conversation history using a JavaScript array.

Example:

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

The complete `messages` array is sent to the backend with every request.

This allows the AI model to understand previous interactions and respond appropriately to follow-up questions.

Without conversation history, every message would be treated as a separate conversation.

---

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

### Backend Files

| File | Description |
|---|---|
| `server.js` | Express server and OpenRouter integration |
| `package.json` | Backend dependencies and scripts |
| `.env` | Secret API credentials |
| `.env.example` | Environment variable template |

### Frontend Files

| File | Description |
|---|---|
| `index.html` | Chat interface structure |
| `script.js` | Chat functionality and API communication |
| `style.css` | Chat interface styling |

---

## ⚙️ Installation and Local Setup

### Prerequisites

Install the following:

- Node.js: https://nodejs.org/
- Git: https://git-scm.com/
- Visual Studio Code: https://code.visualstudio.com/
- OpenRouter Account: https://openrouter.ai/

### Step 1: Clone the repository

```bash
git clone https://github.com/anurag815311/challenge-7-ai-chatbot.git
```

### Step 2: Navigate to the project

```bash
cd challenge-7-ai-chatbot
```

### Step 3: Install backend dependencies

```bash
cd backend
npm install
```

### Step 4: Configure environment variables

Create a `.env` file inside the backend folder.

```env
OPENROUTER_API_KEY=your-actual-api-key
PORT=3000
```

### Step 5: Start the backend server

```bash
npm start
```

Expected output:

```text
Server is running on port 3000
```

### Step 6: Open the frontend

Open `frontend/index.html` using Visual Studio Code Live Server.

The chatbot should now be accessible locally.

---

## 🧪 Testing

The application was tested using the following scenarios:

| Test Case | Expected Result |
|---|---|
| Backend health check | Returns HTTP 200 |
| Send a message | AI generates a response |
| Empty message | Message is not submitted |
| Follow-up question | AI understands previous context |
| Missing API key | Backend returns an error |
| Invalid message format | Backend returns HTTP 400 |
| OpenRouter API failure | Backend returns an appropriate error |

### Health Check Endpoint

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

---

## 🚀 Deployment

The application uses separate hosting services for the frontend and backend.

### 1. Backend Deployment — Render

Platform: https://render.com/

Deployment configuration:

| Setting | Value |
|---|---|
| Service Type | Web Service |
| Runtime | Node |
| Repository | challenge-7-ai-chatbot |
| Branch | feature/ai-chatbot |
| Root Directory | backend |
| Build Command | npm install |
| Start Command | npm start |

Add the following environment variables in the Render dashboard:

```env
OPENROUTER_API_KEY=your-actual-api-key
PORT=3000
```

After deployment, verify the backend using:

```text
https://YOUR-RENDER-SERVICE.onrender.com/health
```

Official documentation:

https://render.com/docs/deploy-node-express-app

### 2. Frontend Deployment — Netlify

Platform: https://www.netlify.com/

Deployment steps:

1. Log in to Netlify.
2. Open the Netlify dashboard.
3. Choose the manual deployment or Git-based deployment option.
4. For manual deployment, upload the `frontend` folder.
5. Wait for the deployment to complete.
6. Copy the generated public URL.

Before deployment, update the frontend API URL in `frontend/script.js`:

```javascript
const API_URL = 'https://YOUR-RENDER-SERVICE.onrender.com/chat';
```

Replace the placeholder with your actual Render backend URL.

Official documentation:

https://docs.netlify.com/deploy/create-deploys/

### Deployment URLs

**Frontend:**

```text
https://YOUR-NETLIFY-SITE.netlify.app
```

**Backend:**

```text
https://YOUR-RENDER-SERVICE.onrender.com
```

**Backend Health Check:**

```text
https://YOUR-RENDER-SERVICE.onrender.com/health
```

> Note: Render's free web services can spin down after inactivity, so the first request after an idle period may take longer. Check the current free-tier limitations before deployment.

---

## 🔄 Fallback AI Provider

If OpenRouter free models are unavailable, Google Gemini API can be used as an alternative.

Provider: Google Gemini

Official website: https://ai.google.dev/

API documentation: https://ai.google.dev/gemini-api/docs

To switch to Gemini using its OpenAI-compatible endpoint, the following changes are required:

**1. Update the API base URL:**

```text
https://generativelanguage.googleapis.com/v1beta/openai/
```

**2. Update the model name:**

Use a currently supported Gemini model, such as `gemini-2.5-flash`, subject to API availability.

The backend request structure can remain largely the same.

A Gemini API key must also be configured securely in the backend environment.

---

## 🌱 Git Workflow

This project follows a feature-branch workflow.

**Main branch:**

```text
main
```

Contains the initial starter project.

**Feature branch:**

```text
feature/ai-chatbot
```

Contains the AI chatbot implementation.

### Create a feature branch

```bash
git checkout -b feature/ai-chatbot
```

### Stage changes

```bash
git add .
```

### Commit changes

```bash
git commit -m "feat: implement AI chatbot with OpenRouter integration and conversation context"
```

### Push changes

```bash
git push origin feature/ai-chatbot
```

### Pull Request

Compare:

- Base branch: `main`
- Compare branch: `feature/ai-chatbot`

Pull Request:

Add the actual GitHub PR URL here.

---

## 📚 Learning Resources

The following official resources can help developers understand the technologies used in this project.

| Resource | Link |
|---|---|
| HTML Documentation | https://developer.mozilla.org/en-US/docs/Web/HTML |
| CSS Documentation | https://developer.mozilla.org/en-US/docs/Web/CSS |
| JavaScript Documentation | https://developer.mozilla.org/en-US/docs/Web/JavaScript |
| Node.js Documentation | https://nodejs.org/docs/latest/api/ |
| Express.js Documentation | https://expressjs.com/ |
| OpenRouter Documentation | https://openrouter.ai/docs |
| Git Documentation | https://git-scm.com/doc |
| GitHub Documentation | https://docs.github.com/ |
| Render Documentation | https://render.com/docs |
| Netlify Documentation | https://docs.netlify.com/ |
| Gemini API Documentation | https://ai.google.dev/gemini-api/docs |

---

## 🔮 Future Improvements

Some features that could be added in future versions:

- Streaming AI responses.
- Markdown rendering for AI responses.
- Chat session management.
- Conversation export.
- Clear conversation functionality.
- Multiple AI model selection.
- Improved mobile responsiveness.
- Rate limiting and request throttling.
- Authentication and user-specific chat history.

---

## 👨‍💻 Author

**Anurag Kumar Singh**


GitHub: https://github.com/anurag815311

---

## 📄 Assignment Information

**Challenge #7 — Build and Deploy Your First AI Chatbot**

Project Engineering — Kalvium

The project demonstrates full-stack development, REST API integration, environment variable management, AI model integration, conversation context handling, Git version control, and cloud deployment.

---

⭐ If you find this project useful, feel free to explore the repository and its implementation.