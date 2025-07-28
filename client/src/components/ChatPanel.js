"use client";
import { useState, useRef, useEffect } from "react";
import Message from "./Message";

export default function ChatPanel({ sessionId, messages, onSend, loading }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto pr-2 flex flex-col items-end">
        {messages.map((msg, idx) => (
          <Message key={idx} message={msg} />
        ))}
        {loading && !messages.some((msg) => msg.content === "Thinking...") && (
          <div className="flex items-center justify-end w-full mb-2 pr-4">
            <span className="flex space-x-1">
              <span
                className="block w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></span>
              <span
                className="block w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="block w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></span>
            </span>
            <span className="ml-2 text-blue-300 text-xs">Thinking…</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input area */}
      <form
        onSubmit={handleSend}
        className="flex items-center mt-4 bg-gray-800 rounded-lg p-2"
      >
        <input
          className="flex-1 bg-transparent text-gray-200 p-2 outline-none"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your prompt..."
          disabled={loading}
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}