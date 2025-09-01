"use client";
import Link from "next/link";
import { useAuth } from "./AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <nav className="w-full bg-white/95 shadow-md py-3 px-6 flex items-center justify-between border-b border-blue-100 transition-colors duration-500">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="font-extrabold text-2xl md:text-3xl tracking-wide select-none focus:outline-none"
          style={{ fontFamily: "Geist, Inter, Segoe UI, Arial, sans-serif" }}
        >
          <span
            className="bg-gradient-to-r from-blue-600 via-green-400 to-blue-400 bg-clip-text text-transparent drop-shadow-md"
            style={{
              WebkitTextStroke: "1px #e0f2fe",
              textShadow: "0 2px 8px rgba(34,197,246,0.15)",
              letterSpacing: "0.04em",
            }}
          >
            MedRec
          </span>
        </Link>
        {token && (
          <>
            <Link
              href="/profile"
              className="text-blue-700/90 hover:text-green-500 transition-colors duration-300 px-2 py-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              Profile
            </Link>
            <Link
              href="/medical-history"
              className="text-blue-700/90 hover:text-green-500 transition-colors duration-300 px-2 py-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              Medical History
            </Link>
            <Link
              href="/allergies"
              className="text-blue-700/90 hover:text-green-500 transition-colors duration-300 px-2 py-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              Allergies
            </Link>
            <Link
              href="/family-history"
              className="text-blue-700/90 hover:text-green-500 transition-colors duration-300 px-2 py-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              Family History
            </Link>
            <Link
              href="/emergency-contact"
              className="text-blue-700/90 hover:text-green-500 transition-colors duration-300 px-2 py-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              Emergency Contact
            </Link>
            <Link
              href="/surgeries"
              className="text-blue-700/90 hover:text-green-500 transition-colors duration-300 px-2 py-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              Surgeries
            </Link>
            <Link
              href="/medications"
              className="text-blue-700/90 hover:text-green-500 transition-colors duration-300 px-2 py-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              Medications
            </Link>
          </>
        )}
      </div>
      <div>
        {token ? (
          <button
            onClick={logout}
            className="bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold px-4 py-1 rounded shadow hover:from-blue-600 hover:to-green-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-200 animate-fade-in"
          >
            Logout
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className="text-blue-700/90 hover:text-green-500 px-3 transition-colors duration-300"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-blue-700/90 hover:text-green-500 px-3 transition-colors duration-300"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
