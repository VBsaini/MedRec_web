"use client";
import RequireAuth from "../RequireAuth";
import { useAuth } from "../AuthContext";

export default function DashboardPage() {
  const { logout } = useAuth();

  return (
    <RequireAuth>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p className="mb-6">Welcome to your MedRec dashboard.</p>
        <button onClick={logout} className="bg-red-600 text-white p-2 rounded">
          Logout
        </button>
      </div>
    </RequireAuth>
  );
}
