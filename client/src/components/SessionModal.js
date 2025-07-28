"use client";
import { useState } from "react";

export default function SessionModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Session name is required.");
      return;
    }
    setError("");
    await onCreate(name.trim());
    setName("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 rounded-xl shadow-2xl p-8 w-full max-w-sm border border-gray-700 relative">
        <button
          className="absolute top-2 right-3 text-gray-400 hover:text-gray-200 text-xl"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold text-gray-200 mb-4">Create New Session</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Session name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 bg-gray-800 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            autoFocus
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-gray-400 to-gray-700 text-black py-2 rounded-lg font-semibold hover:from-gray-300 hover:to-gray-600 transition shadow-md"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}