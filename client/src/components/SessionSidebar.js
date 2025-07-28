"use client";
import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function SessionSidebar({ activeSessionId, onSelect, onCreate, onDelete, refetchKey }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, { method: "POST", credentials: "include" });
      localStorage.removeItem("token");
      window.location.href = "/login";
    } catch (err) {
      alert("Logout failed.");
    }
  };

  // Fetch sessions on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${API_BASE_URL}/api/sessions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async res => {
        let data;
        try {
          data = await res.json();
        } catch (e) {
          console.error("Failed to parse JSON:", e);
          setSessions([]);
          setLoading(false);
          return;
        }
        if (!Array.isArray(data)) {
          // Handle unauthorized or error
          if (data.error === "Unauthorized") {
            // Redirect to login or show a message
            window.location.href = "/login";
          } else {
            console.error("Sessions API returned:", data);
            setSessions([]);
          }
        } else {
          setSessions(data);
        }
        setLoading(false);
      });
  }, [refetchKey]); // refetch when key changes

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <span className="text-lg font-bold text-gray-200">Sessions</span>
        <button
          onClick={onCreate}
          className="bg-gray-700 text-gray-200 px-2 py-1 rounded hover:bg-gray-600"
          title="New Session"
        >
          +
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-gray-400 p-4">Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="text-gray-400 p-4">No sessions yet.</div>
        ) : (
          sessions.map((session) => (
            <div
              key={session._id}
              className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-800 ${
                activeSessionId === session._id ? "bg-gray-800 border-l-4 border-blue-500" : ""
              }`}
              onClick={() => onSelect(session)}
            >
              <span className="truncate text-gray-200">{session.name}</span>
              <button
                onClick={e => {
                  e.stopPropagation();
                  onDelete(session._id);
                }}
                className="ml-2 text-gray-400 hover:text-red-400"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
      {/* Logout button at the bottom */}
      <div className="mt-auto mb-4 px-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}