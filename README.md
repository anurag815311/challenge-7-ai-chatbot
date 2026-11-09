# 🤖 AI Chatbot — Build and Deploy Your First AI Chatbot

A full-stack AI chatbot built using **HTML, CSS, JavaScript, Node.js, Express, and OpenRouter**. Users can send messages through a web interface, receive AI-generated responses, and continue a conversation with context from earlier messages in the same session.

The application uses a client-server architecture: the frontend communicates with the Express backend, and the backend makes requests to OpenRouter while keeping API credentials server-side.

---

## 🌐 Live Deployment and Project Links

| Resource | Link |
|---|---|
| Live Frontend | https://beautiful-daffodil-637bc9.netlify.app |
| Live Backend | https://challenge-7-ai-chatbot.onrender.com |
| Backend Health Check | https://challenge-7-ai-chatbot.onrender.com/health |
| GitHub Repository | https://github.com/anurag815311/challenge-7-ai-chatbot |
| Pull Request | https://github.com/anurag815311/challenge-7-ai-chatbot/pull/1 |
| Walkthrough Video | Add the updated chatbot walkthrough link after recording and uploading it |

> **Deployment configuration:** The production frontend must send chat requests to `https://challenge-7-ai-chatbot.onrender.com/chat`. The local development URL `http://localhost:3000/chat` is only for running the backend on the same computer. A deployed frontend must not use localhost. The live request and contextual follow-up must be tested after the latest Netlify deployment; the URLs above alone do not prove that a live conversation has succeeded.

## 📌 What I Built

I built a minimal AI chatbot with:

- A frontend chat interface with a message input, send button, and conversation display.
- A Node.js and Express backend with a `POST /chat` endpoint.
- OpenRouter integration for AI-generated responses.
- Conversation history maintained in a frontend JavaScript array.
- Backend validation and error handling for incoming messages and AI API failures.
- Environment-variable-based API key management.
- Separate frontend and backend deployments using Netlify and Render.

## 🤖 API and Model

**Question 1: Which API and model did I use?**

- **Provider:** OpenRouter
- **API:** OpenRouter Chat Completions API
- **Endpoint:** `https://openrouter.ai/api/v1/chat/completions`
- **Model configuration:** `openrouter/free`

The application uses the `openrouter/free` router. It selects an available supported free model, so the exact underlying model can vary between requests. It would therefore be inaccurate to describe the implementation as using one fixed model such as `openai/gpt-4o-mini`.

The backend forwards the complete conversation history to OpenRouter and returns the generated response to the frontend.

Useful resources:

- [OpenRouter](https://openrouter.ai/)
- [OpenRouter API documentation](https://openrouter.ai/docs)
- [OpenRouter free models](https://openrouter.ai/collections/free-models)

## 🔐 Why Is the API Call Made From the Backend?

**Question 2: Why did I use the backend instead of calling the AI API directly from the frontend?**

An API key placed in frontend JavaScript can be inspected through browser DevTools, downloaded source files, or network requests. A visitor could copy the key and make unauthorized requests using my account, potentially consuming credits or causing unexpected charges.

For this reason, the frontend sends messages only to the Express backend. The backend reads `OPENROUTER_API_KEY` from its environment and attaches the key to the request sent to OpenRouter. The secret is not included in frontend code or returned to the browser.

### Environment variables

For local development, create `backend/.env`:

```env
OPENROUTER_API_KEY=your-actual-api-key
PORT=3000
```

The `.env` file must be excluded through `.gitignore` and must never be committed.

The committed `backend/.env.example` contains placeholders:

```env
OPENROUTER_API_KEY=your-openrouter-api-key-here
GEMINI_API_KEY=your-gemini-api-key-here
PORT=3000
```

For production, configure `OPENROUTER_API_KEY` in the Render service's environment-variable settings.

The backend reads the key using:

```javascript
const apiKey = process.env.OPENROUTER_API_KEY;
```

## 🧩 Development Problem Encountered and How I Resolved It

One problem I encountered while moving the application from local development to deployment was the frontend API URL.

During local development, the frontend used:

```javascript
const API_URL = 'http://localhost:3000/chat';
```

That address works only when the browser and backend are running on the same computer. After deploying the frontend to Netlify, a visitor's browser would interpret `localhost` as that visitor's own computer, not my Render server. As a result, the deployed frontend would not reach the deployed backend.

The production frontend configuration needs to use the Render endpoint instead:

```javascript
const API_URL = 'https://challenge-7-ai-chatbot.onrender.com/chat';
```

This distinction between local and production configuration is important: the local URL is for local testing, while the Render URL is for the publicly deployed frontend. After changing the frontend source, the updated frontend must also be redeployed to Netlify.

**Verification still required after the latest deployment:** open the live Netlify site, send a message, and inspect the browser Network tab. The `/chat` request URL should be `https://challenge-7-ai-chatbot.onrender.com/chat`, and both an initial response and a contextual follow-up should succeed. Do not mark this verification complete until it has been tested.

## 🔄 Conversation Context Management

The chatbot maintains conversation history in a JavaScript array.

Example message structure:

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

For each new message:

1. The frontend adds the user's message to the `messages` array.
2. It sends the complete array to the backend.
3. The backend forwards the conversation history to OpenRouter.
4. The AI generates a response using the previous messages as context.
5. The frontend adds the assistant's response to the array and displays it.

This allows follow-up questions to refer to earlier messages in the same session. The history is held in frontend memory; it is not persisted in a database and will not survive a page refresh.

## ⚙️ Important Backend Implementation Decision

The AI request is handled by the asynchronous Express route handler registered in `backend/server.js`:

```javascript
app.post('/chat', async (req, res) => {
    // Validate the incoming messages.
    // Read the API key from the environment.
    // Send the conversation history to OpenRouter.
    // Return the generated response.
});
```

The external AI request is made inside this handler using `fetch()`:

```javascript
const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'openrouter/free',
            messages: messages
        })
    }
);
```

I chose to send the complete `messages` array rather than only the latest user message because the model needs the earlier user and assistant turns to answer follow-up questions with context. I also validate the request before making the external API call so malformed input can be rejected without unnecessarily contacting the AI provider.

## 🚫 Features Intentionally Not Included

This implementation focuses on demonstrating a basic full-stack AI integration. The following features are outside the current scope:

| Feature not included | Reason for excluding it from this version |
|---|---|
| User authentication | The challenge focuses on the AI integration and does not require user accounts. |
| Database persistence | Conversation history is kept in frontend memory for the current session. A database was not necessary to demonstrate contextual requests. |
| Multiple chat sessions | The current implementation demonstrates one conversation history at a time. |
| Streaming responses | A standard request-response flow was sufficient to demonstrate the backend integration and return an AI response. |
| File and image uploads | The current interface is designed for text-based conversations. |
| User-specific chat history | There is no authentication or database layer to associate saved conversations with individual users. |
| Rate limiting | Advanced request throttling was outside the initial scope; it would be important to add before handling wider public usage. |

These are scope decisions for this version, not claims that the features are technically impossible. They are possible future improvements.

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
       AVAILABLE FREE MODEL
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
| Git and GitHub | Version control |
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

- Node.js and npm
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

For local development, the frontend API URL should be:

```javascript
const API_URL = 'http://localhost:3000/chat';
```

For the deployed frontend, it should be:

```javascript
const API_URL = 'https://challenge-7-ai-chatbot.onrender.com/chat';
```

Use the appropriate URL for the environment. Do not deploy the localhost configuration to Netlify.

## 🧪 Testing

The following scenarios should be tested:

| Test case | Expected result |
|---|---|
| Backend health check | Returns HTTP 200 |
| Send a message | AI generates a response |
| Empty message | Message is not submitted |
| Follow-up question | AI can use earlier conversation context |
| Missing API key | Backend returns an error |
| Invalid message format | Backend returns HTTP 400 |
| OpenRouter API failure | Backend returns an appropriate error |
| Deployed frontend request | Browser sends `/chat` to the Render backend, not localhost |

### Health check

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

### Chat endpoint

```http
POST /chat
```

Example request:

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

### Backend deployment — Render

**Live backend:** https://challenge-7-ai-chatbot.onrender.com

| Setting | Value |
|---|---|
| Platform | Render |
| Service type | Web Service |
| Runtime | Node.js |
| Repository | challenge-7-ai-chatbot |
| Branch | feature/ai-chatbot |
| Build command | `cd backend && npm install` |
| Start command | `cd backend && npm start` |

Configure `OPENROUTER_API_KEY` in the Render dashboard's environment variables. Do not put the actual key in the repository.

### Frontend deployment — Netlify

**Live frontend:** https://beautiful-daffodil-637bc9.netlify.app

The production frontend must use this backend URL:

```javascript
const API_URL = 'https://challenge-7-ai-chatbot.onrender.com/chat';
```

After changing the frontend source, redeploy the `frontend` folder or wait for the connected Netlify Git deployment to finish.

### Deployment health check

https://challenge-7-ai-chatbot.onrender.com/health

Render free services may spin down after inactivity, so the first request after an idle period may take longer. A successful health check confirms that the health route responds; it does not by itself prove that the AI `/chat` integration works.

## 💰 Estimated Cost and Calculation

The application is configured to use OpenRouter's `openrouter/free` router. The following is an illustrative estimate under the assumption that every request is served by a free model and the hosting services remain within their applicable free-plan limits.

### AI request calculation

| Usage assumption | Calculation | Estimated AI API cost |
|---|---:|---:|
| 100 requests | 100 × $0.00 | $0.00 |
| 500 requests | 500 × $0.00 | $0.00 |
| 1,000 requests | 1,000 × $0.00 | $0.00 |

For example:

```text
Assumed monthly requests = 1,000
Assumed cost per request = $0.00

Estimated AI API cost
= 1,000 × $0.00
= $0.00
```

### Hosting estimate

| Service | Assumption | Illustrative monthly cost |
|---|---|---:|
| Netlify | Free plan, within its usage limits | $0.00 |
| Render | Free plan, within its usage limits | $0.00 |
| OpenRouter | Free model is available and used | $0.00 |
| **Illustrative total** | **All free-plan assumptions hold** | **$0.00/month** |

This is an estimate, not a guaranteed price or a statement of actual historical expenditure. Free-model availability, rate limits, hosting allowances, and provider pricing can change. Paid model use or exceeding a provider's free limits may create charges. Check the OpenRouter usage dashboard and the Netlify and Render billing dashboards for actual usage and costs.

## 🔁 Fallback AI Provider — Google Gemini

**Question 3: Which provider would I use if OpenRouter becomes unavailable or free models are no longer accessible?**

I would consider the Google Gemini API as the fallback provider.

- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API documentation](https://ai.google.dev/gemini-api/docs)

To switch to Gemini using its OpenAI-compatible endpoint, the two main code changes are:

**1. Change the API base URL**

```text
https://generativelanguage.googleapis.com/v1beta/openai/
```

**2. Change the model name**

```javascript
model: 'gemini-2.5-flash'
```

The model name is subject to current Gemini API availability. The backend request structure can remain largely the same. A Gemini API key must be configured securely in the backend environment and must never be exposed in frontend JavaScript.

## 🤖 AI Assistance and Code Attribution

AI assistance was used during development to help draft and refine parts of the implementation, including the initial Express `/chat` route and frontend message-handling logic.

I reviewed and adapted the generated suggestions to fit the project structure and requirements, including message validation, environment-variable-based API key handling, conversation-history forwarding, and frontend/backend configuration.

AI assistance was used as a development aid. The final repository should be reviewed and tested by me, and any code I cannot explain should be investigated before submission.

## 🌱 Git Workflow

The project follows a feature-branch workflow.

- **Main branch:** `main` — contains the initial starter project.
- **Feature branch:** `feature/ai-chatbot` — contains the chatbot implementation.

Create the feature branch:

```bash
git checkout -b feature/ai-chatbot
```

Stage and commit changes:

```bash
git add .
git commit -m "feat: implement AI chatbot with OpenRouter integration and conversation context"
```

Push changes:

```bash
git push origin feature/ai-chatbot
```

### Pull request

- **Base branch:** `main`
- **Compare branch:** `feature/ai-chatbot`

[View Pull Request #1](https://github.com/anurag815311/challenge-7-ai-chatbot/pull/1)

## 🎥 Project Walkthrough

Add the updated Google Drive video link after recording the revised walkthrough.

The video should demonstrate:

1. The live deployed chatbot responding to a message.
2. A contextual follow-up that uses an earlier message.
3. The exact backend `/chat` handler and the `fetch()` request to OpenRouter.
4. The API key being read from `process.env.OPENROUTER_API_KEY`, without revealing its value.
5. The local-versus-production API URL decision.
6. The README's API/model, backend security, excluded features, cost assumptions, and AI-assistance sections.

Keep the camera visible throughout the recording, as required by the assignment.

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
- Database-backed conversation persistence.

## 👨‍💻 Author

**Anurag Kumar Singh**

GitHub: [anurag815311](https://github.com/anurag815311)

## 📄 Assignment Information

**Challenge #7 — Build and Deploy Your First AI Chatbot**

Project Engineering — Kalvium

This project demonstrates full-stack development, REST API integration, environment-variable management, AI model integration, conversation-context handling, Git version control, and cloud deployment.
