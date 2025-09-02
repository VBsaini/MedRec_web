"use client";
import RequireAuth from "../RequireAuth";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";

export default function FamilyHistoryPage() {
  const { token } = useAuth();
  const [family, setFamily] = useState([]);
  const [form, setForm] = useState({ relationship: "", conditions: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { userId: ctxUserId } = useAuth();
  const userId =
    ctxUserId ||
    (typeof window !== "undefined" ? localStorage.getItem("userId") : null);

  useEffect(() => {
    async function fetchFamily() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/records/family-history/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch family history");
        const data = await res.json();
        setFamily(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Could not load family history");
      }
      setLoading(false);
    }
    if (userId && token) fetchFamily();
  }, [userId, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/records/family-history/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("Add failed");
      setSuccess("Family history added!");
      setForm({ relationship: "", conditions: "" });
      // Refresh list
      const data = await res.json();
      setFamily(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Could not add family history");
    }
  };

  return (
    <RequireAuth>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg border border-blue-100">
          <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Family History
          </h1>
          {loading ? (
            <div className="text-blue-500 text-center">Loading...</div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4">
              <div className="text-red-500 text-center">{error}</div>
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("family-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add Family History
              </button>
            </div>
          ) : (
            <>
              <form
                id="family-form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 mb-6"
              >
                <input
                  name="relationship"
                  value={form.relationship}
                  onChange={handleChange}
                  placeholder="Relationship"
                  className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-gray-900 placeholder-gray-500"
                  style={{ color: "#222", background: "#fff" }}
                />
                <input
                  name="conditions"
                  value={form.conditions}
                  onChange={handleChange}
                  placeholder="Conditions"
                  className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-gray-900 placeholder-gray-500"
                  style={{ color: "#222", background: "#fff" }}
                />
                {success && (
                  <div className="text-green-600 text-center">{success}</div>
                )}
                {error && (
                  <div className="text-red-500 text-center">{error}</div>
                )}
                {/* Removed extra blue add button */}
              </form>
              <div>
                <h2 className="text-lg font-semibold text-blue-600 mb-2">
                  Your Family History
                </h2>
                <ul className="space-y-2">
                  {family.length === 0 && (
                    <li className="text-gray-500 flex flex-col items-center gap-3">
                      <span>
                        No data yet. Click Add to create your first entry.
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          document
                            .getElementById("family-form")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Add Family History
                      </button>
                    </li>
                  )}
                  {family.map((f, i) => (
                    <li
                      key={i}
                      className="bg-blue-50 rounded p-2 border border-blue-100"
                    >
                      <span className="font-semibold">{f.relationship}</span>:{" "}
                      {f.conditions}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
