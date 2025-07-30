# CODE-CRAFT-AI

A modern, full-stack AI-powered code playground for building, previewing, and exporting React components and HTML/JS code.  
Built with Next.js, React, Node.js, MongoDB, and OpenRouter LLM API.

---

## ✨ Features

- **AI Chat Assistant:** Generate React components or HTML/JS code via natural language prompts.
- **Live Preview:** Instantly preview React, JSX, or HTML code in a secure sandbox.
- **Syntax Highlighting:** Readable, copyable code blocks for all languages.
- **Session Management:** Save, load, and delete chat/code sessions.
- **Authentication:** Secure login/register with JWT and Google OAuth.
- **Responsive UI:** Clean, modern interface with Tailwind CSS.
- **Copy to Clipboard:** Easily copy code snippets.
- **Performance Optimized:** Memoized components for smooth UX.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Redis (Upstash)
- **AI Integration:** OpenRouter API (supports Llama, Gemini, GPT, etc.)
- **Authentication:** JWT, Google OAuth
- **Other:** React Live, PrismJS

---

## 🚀 Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/react-playground.git
cd react-playground

```

### 2. Install Dependencies

### For the backend (server):

```sh
cd server
npm install
```

### For the frontend (client):

```sh
cd ../client
npm install
```


### 3. Set up Environment Variables

Create a `.env` file in the `/server` directory with the following variables (example):

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
OPENROUTER_API_KEY=your_openrouter_api_key
```

### 4. Run locally

#### Backend

```sh
cd server
npm install
npm run dev
```

#### frontend
```sh
cd client
npm install
npm run dev
```

## 📂 Project Structure

```
react-playground/ 
├── client/ # Next.js frontend 
│ ├── src/ # Source code 
│ │ ├── app/ # Next.js app directory (pages, layout) 
│ │ │ ├── session/ # Session-related pages 
│ │ │ │ ├── page.js # Main session page 
│ │ │ │ └── ... 
│ │ ├── components/ # Reusable React components 
│ │ │ ├── ChatPanel.js # Chat interface 
│ │ │ ├── CodePreview.js # Static code display 
│ │ │ ├── LivePreview.js # Iframe-based HTML preview 
│ │ │ ├── Message.js # Individual chat message 
│ │ │ ├── ReactLivePreview.js # React code editor and preview 
│ │ │ └── ... 
│ │ ├── utils/ # Utility functions 
│ │ │ ├── extractCodeBlocks.js # Code block parsing 
│ │ │ └── ... 
│ │ ├── ... 
│ ├── public/ # Static assets (images, fonts) 
│ ├── tailwind.config.js # Tailwind CSS configuration 
│ ├── next.config.js # Next.js configuration 
│ ├── package.json # Dependencies and scripts 
│ └── ... 
├── server/ # Express backend 
│ ├── controllers/ # Route handlers/controllers

│ ├── models/ # Mongoose models 
│ ├── routes/ # API routes 
│ ├── utils/ # Backend utilities 
│ ├── .env # Environment variables (API keys, etc.) 
│ ├── server.js # Main server file 
│ ├── package.json # Dependencies and scripts 
│ └── ... 
├── README.md # Project documentation (this file) 
├── .gitignore # Files to exclude from version control 
└── ... # Other configuration and support files
```


## 🤖 AI Models Supported

This project leverages the OpenRouter API, allowing you to use a variety of Large Language Models (LLMs) for code generation. Some of the supported models include:

- **Meta:** Llama 3, Llama 2
- **Google:** Gemini
- **OpenAI:** GPT-3.5 Turbo, GPT-4
- **Mistral AI:** Mistral 7B
- **HuggingFaceH4:** Zephyr 7B

You can easily switch between models by modifying the `model` parameter in the backend controller (`server/controllers/aiController.js`).

> **Note:**  
> Availability and pricing of models may vary on OpenRouter. Check the [OpenRouter models page](https://openrouter.ai/docs#models) for the latest information. Free-tier models may have


## 📝 Usage

1.  **Start the Development Servers:** Follow the steps in the "Getting Started" section to run both the frontend and backend development servers.
2.  **Open the Application:** Access the application in your web browser at `http://localhost:3000`.
3.  **Register or Log In:** Create a new account or log in with your existing credentials. You can also use Google OAuth for authentication.
4.  **Create a New Session:** Click the "New Session" button to start a new coding session.
5.  **Enter a Prompt:** Type a descriptive prompt in the chat input (e.g., "Create a simple React component with a button that displays an alert when clicked").
6.  **Generate Code:** Send the prompt to the AI assistant. The generated code will appear in the chat.
7.  **Preview and Edit:** The code will be automatically rendered in the live preview area. You can copy the code to your clipboard using the "Copy" button.
8.  **Manage Sessions:** Save, load, or delete your coding sessions

##  Troubleshooting

If you do not see no response for prompt too many times maybe the free token limit of openrouter has expired usethe following credentials for the resulst that were already generated.

To test the app or for reference, you can use the following user credentials:

- **Email:** `ratul.9paul@gmail.com`
- **Password:** `Broski@22`

If you continue to have issues, try logging out and logging in again 

## 👤 Author

**Ratul Paul**

- [LinkedIn](https://www.linkedin.com/in/ratulpaul2002/)
- [GitHub](https://github.com/hacker2406)

## 📄 License

This project is for demonstration and educational purposes only. Feel free to use the code as a reference
