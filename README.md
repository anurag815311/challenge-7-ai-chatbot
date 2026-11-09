# AI Chatbot — Build and Deploy Your First AI Chatbot

A full-stack, session-based AI chatbot built with **HTML, CSS, JavaScript, Node.js, Express, and OpenRouter**.

The chatbot is designed around a practical frustration I encountered while learning and explaining programming: when someone gets stuck on a concept, they often need to search across multiple pages or repeat the context every time they ask a follow-up question. This project provides one conversational place to ask a programming question, receive an explanation, and continue with related questions while the current session's conversation context is retained.

> **Important implementation note:** This README documents a fixed OpenRouter model configuration. To make the code match this documentation, update the `model` value in `backend/server.js` from `openrouter/free` to `liquid/lfm-3-1.7b:free`, then redeploy the backend. Do not claim the fixed model is deployed until this change has been committed and verified.

---

## Live application and links

| Resource | Link |
|---|---|
| Frontend | https://beautiful-daffodil-637bc9.netlify.app/ |
| Backend | https://challenge-7-ai-chatbot.onrender.com/ |
| Backend health check | https://challenge-7-ai-chatbot.onrender.com/health |
| GitHub repository | https://github.com/anurag815311/challenge-7-ai-chatbot |
| Pull request | https://github.com/anurag815311/challenge-7-ai-chatbot/pull/1 |
| Walkthrough video | **Add the new recording link here after uploading it.** |

The production frontend must send chat requests to:

```javascript
const API_URL = 'https://challenge-7-ai-chatbot.onrender.com/chat';
```

For local development, use `http://localhost:3000/chat`. Do not deploy the localhost URL to Netlify.

---

## The problem I wanted to solve

When learning or explaining programming, a small doubt can interrupt the learning flow. Finding a clear explanation may require switching between search results, documentation, and tutorials. A follow-up question can also lose its meaning if the earlier context is not carried forward.

I wanted a lightweight assistant where a learner can:

- Ask a programming or technical question in plain language.
- Get an AI-generated explanation in the same interface.
- Ask a follow-up question without retyping the previous context.
- Explore a concept step by step during one active chat session.

The project addresses this specific use case with a simple conversational interface and session-level context. It is an educational helper, not a replacement for documentation, a mentor, or independently verified technical guidance.

---

## Features

- Responsive chat interface built with HTML, CSS, and JavaScript.
- Express backend exposing `POST /chat`.
- OpenRouter Chat Completions API integration.
- Conversation history sent as a complete `messages` array.
- Backend validation and error handling.
- API credentials loaded from environment variables.
- `.env.example` provided; actual `.env` files excluded from Git.
- Frontend and backend deployed separately on Netlify and Render.

## Technology stack

| Technology | Purpose |
|---|---|
| HTML5 and CSS3 | Chat interface and styling |
| JavaScript | UI behavior and in-session conversation history |
| Node.js | Backend runtime |
| Express | HTTP API and `/chat` route |
| OpenRouter | Hosted model API |
| `fetch()` | Backend HTTP request to OpenRouter |
| `dotenv` | Local environment-variable loading |
| CORS | Cross-origin frontend/backend requests |
| Netlify | Frontend hosting |
| Render | Backend hosting |
| Git and GitHub | Version control and collaboration |

---

## Architecture

```text
Learner
  |
  v
Netlify frontend (HTML / CSS / JavaScript)
  |
  | POST /chat
  | { messages: [...] }
  v
Render backend (Node.js / Express)
  |
  | Reads OPENROUTER_API_KEY from environment
  | Sends model + messages using fetch()
  v
OpenRouter Chat Completions API
  |
  v
Fixed model: liquid/lfm-3-1.7b:free
  |
  v
Backend returns { reply: "..." }
  |
  v
Frontend displays assistant response
```

## API provider, exact model, and backend function

- **Provider:** OpenRouter
- **API:** Chat Completions API
- **Endpoint:** `https://openrouter.ai/api/v1/chat/completions`
- **Fixed model ID for the documented configuration:** `liquid/lfm-3-1.7b:free`

The earlier `openrouter/free` value is a model router. It can choose different underlying models and therefore does not identify one fixed model. For a reproducible configuration, this README specifies the exact model ID above.

### Exact function responsible for the AI request

The request is handled by the `POST /chat` Express route in **`backend/server.js`**:

```javascript
app.post('/chat', async (req, res) => {
    // 1. Validate req.body.messages.
    // 2. Read OPENROUTER_API_KEY from process.env.
    // 3. Call OpenRouter with fetch().
    // 4. Extract the assistant message.
    // 5. Return { reply } to the frontend.
});
```

The external API call is made with `fetch()` inside this route:

```javascript
const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'liquid/lfm-3-1.7b:free',
            messages
        })
    }
);
```

**Keep the code and README in sync:** if the deployed `backend/server.js` still contains `model: 'openrouter/free'`, it is still using the router rather than the fixed model documented here. Change it, test it, commit it, and redeploy before presenting this as the deployed configuration.

Model listing and pricing can change. Check the [OpenRouter model catalogue](https://openrouter.ai/models) and the [LFM3-1.7B model page](https://openrouter.ai/liquid/lfm-3-1.7b:free) before relying on its current availability.

---

## Why the AI API call happens on the backend

The browser must not contain the OpenRouter secret. Frontend JavaScript and browser network requests can be inspected by visitors. If the key were placed in frontend code, someone could copy it and make requests using the account's credentials.

Instead:

1. The frontend sends the conversation to the Express backend.
2. The backend reads `OPENROUTER_API_KEY` from its environment.
3. The backend adds the key to the OpenRouter request.
4. The backend returns the generated reply without returning the secret.

The backend reads the key with:

```javascript
const apiKey = process.env.OPENROUTER_API_KEY;
```

### Local environment configuration

Create `backend/.env` locally:

```env
OPENROUTER_API_KEY=your-actual-openrouter-api-key
PORT=3000
```

The repository should contain a placeholder-only `backend/.env.example`:

```env
OPENROUTER_API_KEY=your-openrouter-api-key-here
PORT=3000
```

For production, add `OPENROUTER_API_KEY` in the Render service's environment settings. Never commit the real key or place it in frontend code.

---

## Conversation context: how follow-up questions work

The frontend maintains an array of messages for the active conversation. Each item has a role and content:

```javascript
const messages = [
    { role: 'user', content: 'Explain JavaScript closures.' },
    { role: 'assistant', content: 'A closure is ...' },
    { role: 'user', content: 'Can you show a simple example?' }
];
```

For each new user message:

1. The frontend appends the new user message to `messages`.
2. It sends the complete array to `POST /chat`.
3. The backend validates the array and forwards it to OpenRouter.
4. The model receives the earlier turns along with the latest question.
5. The backend returns the assistant reply.
6. The frontend appends and displays the assistant reply.

### Code decision

I chose to send the complete `messages` array instead of sending only the latest user message. The model needs the previous user and assistant turns to understand references such as “explain that again” or “show another example.” This makes follow-up questions meaningful within the active session.

The current history is held in browser memory. It is not stored in a database and is lost when the page is refreshed.

---

## Development and deployment issue

During deployment, the frontend API URL needs to match the environment.

Local development:

```javascript
const API_URL = 'http://localhost:3000/chat';
```

Production:

```javascript
const API_URL = 'https://challenge-7-ai-chatbot.onrender.com/chat';
```

A visitor's browser interprets `localhost` as the visitor's own computer, not the Render server. Therefore, the deployed Netlify frontend must use the Render URL. After changing the frontend configuration, the frontend must be redeployed.

This was a deployment obstacle, not the user problem the chatbot is intended to solve. The product problem is described in the section above.

---

## Features intentionally left out

This version is intentionally small and focused on a single text conversation.

| Excluded feature | Why it is outside this version |
|---|---|
| Authentication and user accounts | The challenge focuses on the AI chat flow, not account management. |
| Database-backed chat history | In-memory history is sufficient to demonstrate context within one active session. |
| Multiple saved conversations | The current UI handles one active conversation at a time. |
| Streaming tokens | A standard request/response flow keeps the initial implementation simpler. |
| File and image uploads | The current use case is text-based programming questions. |
| User-specific history | There is no authentication or persistence layer to associate conversations with users. |
| Rate limiting and abuse controls | These are important for a public production service but were outside the initial challenge scope. |

These are scope decisions, not technical limitations. They are possible future improvements.

---

## Cost estimate

The documented fixed model, `liquid/lfm-3-1.7b:free`, is listed by OpenRouter as a free model variant with **$0 per million input tokens and $0 per million output tokens** at the time this README was prepared. Free availability and usage limits can change, so verify the model's current pricing before deployment or use.

Source: [OpenRouter — LFM3-1.7B (free)](https://openrouter.ai/liquid/lfm-3-1.7b:free) and [OpenRouter free model catalogue](https://openrouter.ai/collections/free-models/).

### Assumptions for one example request

For a transparent estimate, assume:

- Input: **500 tokens** (conversation history plus latest user message).
- Output: **300 tokens** (assistant response).
- Input rate: **$0.00 per 1,000,000 tokens**.
- Output rate: **$0.00 per 1,000,000 tokens**.

Formula:

```text
Cost per call
= (input_tokens / 1,000,000 × input_rate)
  + (output_tokens / 1,000,000 × output_rate)

= (500 / 1,000,000 × $0.00)
  + (300 / 1,000,000 × $0.00)

= $0.00 + $0.00
= $0.00 per call
```

| Example usage | Estimated input tokens | Estimated output tokens | Model API cost at listed free rates |
|---|---:|---:|---:|
| 1 call | 500 | 300 | $0.00 |
| 100 calls | 50,000 | 30,000 | $0.00 |
| 1,000 calls | 500,000 | 300,000 | $0.00 |

These token counts are planning assumptions, not measured averages from production logs. Actual token usage depends on message length and conversation history. Since the full conversation is sent on each request, input tokens can increase as the chat grows.

### Hosting costs and limits

The frontend and backend are hosted on Netlify and Render. Any $0 hosting estimate depends on the current plan, usage, and platform limits. This README does not claim that hosting is guaranteed to remain free. Check the [Netlify pricing page](https://www.netlify.com/pricing/) and [Render pricing page](https://render.com/pricing) for current terms.

---

## Local installation

### Prerequisites

- Node.js and npm
- Git
- OpenRouter account and API key

### 1. Clone the repository

```bash
git clone https://github.com/anurag815311/challenge-7-ai-chatbot.git
cd challenge-7-ai-chatbot
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Create the environment file

Create `backend/.env`:

```env
OPENROUTER_API_KEY=your-actual-openrouter-api-key
PORT=3000
```

### 4. Start the backend

```bash
npm start
```

The server should report that it is listening on port `3000`.

### 5. Run the frontend locally

Open `frontend/index.html` with VS Code Live Server.

For local testing, configure:

```javascript
const API_URL = 'http://localhost:3000/chat';
```

For the deployed site, configure the Render URL shown in the deployment section. Do not publish the localhost setting.

---

## API reference

### Health check

```http
GET /health
```

The expected response, based on the backend health route, is:

```json
{
  "status": "ok",
  "message": "AI Chatbot backend is running!"
}
```

### Chat

```http
POST /chat
Content-Type: application/json
```

Example request:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Explain JavaScript closures."
    }
  ]
}
```

Expected response shape:

```json
{
  "reply": "A closure is ..."
}
```

The exact reply depends on the model output.

---

## Deployment

### Backend — Render

- Service: Web Service
- Runtime: Node.js
- Build command: `cd backend && npm install`
- Start command: `cd backend && npm start`
- Environment variable: `OPENROUTER_API_KEY`

Live backend: https://challenge-7-ai-chatbot.onrender.com/

### Frontend — Netlify

Deploy the `frontend` directory. The production frontend must use:

```javascript
const API_URL = 'https://challenge-7-ai-chatbot.onrender.com/chat';
```

After pushing changes, confirm that the Netlify deployment has completed before testing the live site.

### Verification checklist

Do not mark an item complete until you have personally tested it.

- [ ] Open the live Netlify frontend.
- [ ] Send a programming question and receive an AI response.
- [ ] Ask a follow-up that depends on the previous answer.
- [ ] In browser DevTools → Network, confirm the request goes to the Render `/chat` URL, not localhost.
- [ ] Confirm the `/health` endpoint returns HTTP 200.
- [ ] Confirm no API key appears in frontend source or browser network requests.
- [ ] Confirm the backend code uses the fixed model ID documented above.
- [ ] Confirm the deployed backend returns a successful response using that model.

A successful health check only verifies the health route. It does not prove that the AI chat integration is working.

---

## Google Gemini as a possible alternative provider

Gemini can be evaluated as an alternative provider if the selected OpenRouter model is unavailable. This is a possible future provider change, not a claim that Gemini is currently integrated into the deployed application.

Google documents an OpenAI-compatible endpoint at:

```text
https://generativelanguage.googleapis.com/v1beta/openai/
```

The model ID and API key must be checked against the current Gemini documentation. Keep the Gemini key on the backend in an environment variable; do not expose it in the frontend.

References:
- [Google AI Studio](https://aistudio.google.com/)
- [Gemini API documentation](https://ai.google.dev/gemini-api/docs)

---

## AI assistance and code attribution

AI assistance was used during development to help draft and refine parts of the implementation. The areas to disclose in the walkthrough are:

- The initial Express `/chat` route and its request/response structure.
- Frontend message-handling and conversation-history logic.
- Documentation wording and setup explanations.

I reviewed and adapted the suggestions for the project. I should be able to explain the final code, including request validation, environment-variable handling, the OpenRouter `fetch()` call, and why the full message history is forwarded.

Update this section if the actual AI-assisted files or changes differ from the list above. Do not attribute code to AI if it was written independently.

---

## Walkthrough video

**Replace this placeholder with the URL of the newly recorded walkthrough.**

The recording should:

1. Keep the presenter visible on camera throughout, if required by the assignment.
2. Open the live deployed chatbot and demonstrate a real question.
3. Ask a contextual follow-up and show how the earlier message is used.
4. Show `backend/server.js`, identify the `app.post('/chat', ...)` handler, and explain the `fetch()` call.
5. Explain the decision to forward the full `messages` array.
6. Identify the AI-assisted code accurately.
7. Show the fixed model ID and explain the per-call token cost calculation.
8. Show the README and the deployed frontend/backend configuration.

The README cannot establish that the camera was on; that must be visible in the actual recording.

---

## Project structure

```text
challenge-7-ai-chatbot/
├── backend/
│   ├── .env                 # Local only; do not commit
│   ├── .env.example         # Placeholder variables only
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── .gitignore
└── README.md
```

The `.env` file is created locally and should be ignored by Git. It should not appear in the committed repository.

## Future improvements

- Persistent chat history with a database.
- Multiple conversations and session management.
- Authentication and user profiles.
- Streaming responses.
- Rate limiting and request monitoring.
- Better error and loading states.
- Programming-focused prompt presets and suggested questions.

---

**Repository:** https://github.com/anurag815311/challenge-7-ai-chatbot
