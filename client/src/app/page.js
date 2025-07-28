"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-900 shadow-2xl rounded-2xl p-12 max-w-xl w-full text-center border border-gray-700 animate-fade-in">
        <h1 className="text-5xl font-extrabold mb-6 text-blue-400 tracking-wide min-h-[3.5rem]">
          Welcome to the React Playground!
        </h1>
        <div className="transition-opacity duration-700 opacity-100">
          <p className="text-2xl text-gray-300 mb-8 font-medium">
            Build, preview, and export AI-generated React components.<br />
            Please login or register to get started.
          </p>
          <div className="flex justify-center gap-6 mt-8">
            <Link href="/login" className="bg-blue-600 text-white text-lg px-8 py-3 rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg">
              Login
            </Link>
            <Link href="/signup" className="bg-gray-800 text-blue-300 text-lg px-8 py-3 rounded-lg border border-gray-700 hover:bg-gray-700 transition font-semibold shadow-lg">
              Register
            </Link>
          </div>
        </div>
      </div>
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1.2s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px);}
          to { opacity: 1; transform: translateY(0);}
        }
      `}</style>
    </div>
  );
}