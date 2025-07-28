"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-lg bg-gradient-to-br from-gray-900/80 to-gray-700/80 shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-700 space-y-6"
      >
        <h2 className="text-3xl font-extrabold text-center text-gray-200 mb-6 tracking-tight drop-shadow-lg">
          Create Account
        </h2>
        <input
          name="name"
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-600 bg-gray-900 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-gray-400 to-gray-700 text-black py-3 rounded-lg font-semibold hover:from-gray-300 hover:to-gray-600 transition shadow-md"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        {error && (
          <p className="text-red-400 text-center mt-2">{error}</p>
        )}
        <p className="text-center text-sm mt-6 text-gray-400">
          Already have an account?{" "}
          <a href="/login" className="text-gray-200 hover:underline font-semibold">
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}