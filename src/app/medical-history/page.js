"use client";
import RequireAuth from "../RequireAuth";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";

export default function MedicalHistoryPage() {
  const { token } = useAuth();
  const [history, setHistory] = useState({
    past_illnesses: "",
    surgeries: [],
    medications: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // prefer userId from AuthContext if available
  const { userId: ctxUserId } = useAuth();
  const userId =
    ctxUserId ||
    (typeof window !== "undefined" ? localStorage.getItem("userId") : null);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/records/medical-history/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch medical history");
        const data = await res.json();
        setHistory(data);
      } catch (err) {
        setError("Could not load medical history");
      }
      setLoading(false);
    }
    if (userId && token) fetchHistory();
  }, [userId, token]);

  const handleChange = (e) => {
    setHistory({ ...history, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/records/medical-history/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(history),
        }
      );
      if (!res.ok) throw new Error("Update failed");
      setSuccess("Medical history updated successfully!");
    } catch (err) {
      setError("Could not update medical history");
    }
  };

  return (
    <RequireAuth>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg border border-blue-100">
          <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Medical History
          </h1>
          {loading ? (
            <div className="text-blue-500 text-center">Loading...</div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4">
              <div className="text-red-500 text-center">{error}</div>
              {token &&
                {
                  /* Removed extra blue add button */
                }}
            </div>
          ) : (
            <form
              id="medical-history-form"
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <textarea
                name="past_illnesses"
                value={history?.past_illnesses || ""}
                onChange={handleChange}
                placeholder="Past Illnesses"
                className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded min-h-[60px] text-gray-900 placeholder-gray-500"
                style={{ color: "#222", background: "#fff" }}
              />
              {(!history || !history.past_illnesses) && (
                <div className="flex flex-col items-center gap-3">
                  <span className="text-gray-500">
                    No data yet. Click Add to create your first entry.
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      document
                        .getElementById("medical-history-form")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Add Medical History
                  </button>
                </div>
              )}
              {/* Surgeries and Medications can be managed in detail on their own pages */}
              {success && (
                <div className="text-green-600 text-center">{success}</div>
              )}
              {error && <div className="text-red-500 text-center">{error}</div>}
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold p-2 rounded shadow hover:from-blue-600 hover:to-green-500 transition"
              >
                Save Changes
              </button>
            </form>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
