"use client";
import SessionSidebar from "@/components/SessionSidebar";
import SessionModal from "@/components/SessionModal";
import ChatPanel from "@/components/ChatPanel";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SessionsPage() {
  const router = useRouter();
  const [activeSession, setActiveSession] = useState(null);
  const [refetchKey, setRefetchKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Get token from URL
  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      // Remove token from URL for cleanliness and force reload
      window.location.replace("/session");
    }
  }, []);

  // 1. When selecting a session, save to localStorage and fetch chat/code
  const handleSelect = (session) => {
    localStorage.setItem("lastSessionId", session._id);
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/sessions/${session._id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const messages =
          data.data?.messages ||
          data.messages ||
          [];
        const code =
          data.data?.code ||
          data.code ||
          "";
        setMessages(messages);
        setCode(code);
        setActiveSession(session);
      });
  };

  const handleCreate = () => setModalOpen(true);

  const handleCreateSession = async (name) => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const data = await res.json();
      setRefetchKey((k) => k + 1);
      if (data && data.session && data.session._id) {
        handleSelect(data.session);
        setModalOpen(false);
        // Add this line to redirect:
        router.push(`/session/${data.session._id}`);
      }
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/sessions/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setActiveSession(null);
    setRefetchKey((k) => k + 1);
  };

  // Handle sending a chat prompt to the backend AI endpoint
  const handleSend = async (prompt) => {
    setLoading(true);

    // 1. Add user's message immediately
    const userMsg = { role: "user", content: prompt };

    // 2. Add temporary "Thinking..." assistant message
    const thinkingMsg = { role: "assistant", content: "Thinking..." };
    setMessages((prev) => [...prev, userMsg, thinkingMsg]);

    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/ai/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        sessionId: activeSession._id,
        prompt,
      }),
    });
    const data = await res.json();

    // 3. Replace the last assistant message ("Thinking...") with the real reply
    setMessages((prev) => {
      // Remove the last message if it's the "Thinking..." placeholder
      const msgs = prev.slice(0, -1);
      // Add the real assistant reply
      if (data.messages && data.messages.length > 0) {
        return [...msgs, data.messages[data.messages.length - 1]];
      }
      return msgs;
    });

    setCode(data.code || "");
    setLoading(false);
  };

  // 2. On mount, restore last session if available
  useEffect(() => {
    const lastSessionId = localStorage.getItem("lastSessionId");
    const token = localStorage.getItem("token");
    if (lastSessionId && token) {
      fetch("http://localhost:5000/api/sessions", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((sessions) => {
          const session = sessions.find((s) => s._id === lastSessionId);
          if (session) handleSelect(session);
        });
    }
  }, [refetchKey]);

  // REMOVE the useEffect that fetches messages on activeSession change!
  // (No need for double-fetch, handleSelect does it all.)

  return (
    <div className="flex h-screen">
      <SessionSidebar
        activeSessionId={activeSession?._id}
        onSelect={handleSelect}
        onCreate={handleCreate}
        onDelete={handleDelete}
        refetchKey={refetchKey}
        className="flex-shrink-0"
      />
      <SessionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateSession}
      />
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-8">
        {activeSession ? (
          <div className="flex-1 flex flex-col">
            <h1 className="text-2xl font-bold text-gray-200 mb-4">
              {activeSession.name}
            </h1>
            <ChatPanel
              sessionId={activeSession._id}
              messages={messages}
              onSend={handleSend}
              loading={loading}
            />
          </div>
        ) : (
          <div className="text-gray-400">Select a session to get started.</div>
        )}
      </main>
    </div>
  );
}