"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        router.push("/session");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-gray-800">
      <div className="backdrop-blur-lg bg-gradient-to-br from-gray-900/80 to-gray-700/80 shadow-2xl rounded-2xl p-10 w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-extrabold text-center text-gray-200 mb-6 tracking-tight drop-shadow-lg">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
            {loading ? "Logging in..." : "Log In"}
          </button>
          {error && (
            <p className="text-red-400 text-center mt-2">{error}</p>
          )}
        </form>
        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-400" />
          <span className="mx-3 text-gray-400 font-medium">or</span>
          <div className="flex-grow h-px bg-gray-400" />
        </div>
        <a
          href="http://localhost:5000/api/auth/google"
          className="w-full flex items-center justify-center gap-2 bg-black border border-gray-400 py-3 rounded-lg font-semibold text-gray-200 hover:bg-gray-900 transition shadow-md"
        >
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path
              fill="#4285F4"
              d="M24 9.5c3.54 0 6.73 1.22 9.24 3.22l6.9-6.9C36.36 2.34 30.54 0 24 0 14.64 0 6.27 5.48 1.98 13.44l8.06 6.27C12.38 13.13 17.73 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.1 24.5c0-1.64-.15-3.22-.42-4.75H24v9.02h12.42c-.54 2.9-2.18 5.36-4.66 7.02l7.26 5.66C43.73 37.36 46.1 31.44 46.1 24.5z"
            />
            <path
              fill="#FBBC05"
              d="M10.04 28.71c-1.13-3.36-1.13-6.96 0-10.32l-8.06-6.27C.36 16.7 0 20.29 0 24c0 3.71.36 7.3 1.98 10.88l8.06-6.27z"
            />
            <path
              fill="#EA4335"
              d="M24 48c6.54 0 12.36-2.16 16.9-5.88l-7.26-5.66c-2.02 1.36-4.6 2.16-7.64 2.16-6.27 0-11.62-3.63-14.96-8.94l-8.06 6.27C6.27 42.52 14.64 48 24 48z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Login with Google
        </a>
        <p className="text-center text-sm mt-6 text-gray-400">
          Don't have an account?{" "}
          <a href="/signup" className="text-gray-200 hover:underline font-semibold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}