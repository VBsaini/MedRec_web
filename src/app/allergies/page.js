"use client";
import RequireAuth from "../RequireAuth";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";

export default function AllergiesPage() {
  const { token } = useAuth();
  const [allergies, setAllergies] = useState([]);
  const [form, setForm] = useState({
    allergens: "",
    reactions: "",
    severity: "",
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
    async function fetchAllergies() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://localhost:3000/api/records/allergy/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          const text = await res.text().catch(() => null);
          throw new Error(
            `Failed to fetch allergies: ${res.status} ${text || res.statusText}`
          );
        }
        const data = await res.json();
        setAllergies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("fetchAllergies error:", err);
        setError(err.message || "Could not load allergies");
      }
      setLoading(false);
    }
    if (userId && token) {
      fetchAllergies();
    } else {
      // nothing to fetch - ensure we stop the loading spinner and show UI
      setLoading(false);
      setAllergies([]);
    }
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
        `http://localhost:3000/api/records/allergy/${userId}`,
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
      setSuccess("Allergy added!");
      setForm({ allergens: "", reactions: "", severity: "" });
      // Refresh list
      const data = await res.json();
      setAllergies(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Could not add allergy");
    }
  };

  return (
    <RequireAuth>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg border border-blue-100">
          <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Allergies
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
                    .getElementById("allergy-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add Allergy
              </button>
            </div>
          ) : (
            <>
              <form
                id="allergy-form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 mb-6"
              >
                <input
                  name="allergens"
                  value={form.allergens}
                  onChange={handleChange}
                  placeholder="Allergens"
                  className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-gray-900 placeholder-gray-500"
                  style={{ color: "#222", background: "#fff" }}
                />
                <input
                  name="reactions"
                  value={form.reactions}
                  onChange={handleChange}
                  placeholder="Reactions"
                  className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-gray-900 placeholder-gray-500"
                  style={{ color: "#222", background: "#fff" }}
                />
                <input
                  name="severity"
                  value={form.severity}
                  onChange={handleChange}
                  placeholder="Severity"
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
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold p-2 rounded shadow hover:from-blue-600 hover:to-green-500 transition"
                >
                  Add Allergy
                </button>
              </form>
              <div>
                <h2 className="text-lg font-semibold text-blue-600 mb-2">
                  Your Allergies
                </h2>
                <ul className="space-y-2">
                  {allergies.length === 0 && (
                    <li className="text-gray-500 flex flex-col items-center gap-3">
                      <span>
                        No data yet. Click Add to create your first entry.
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          document
                            .getElementById("allergy-form")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Add Allergy
                      </button>
                    </li>
                  )}
                  {allergies.map((a, i) => (
                    <li
                      key={i}
                      className="bg-blue-50 rounded p-2 border border-blue-100"
                    >
                      <span className="font-semibold">{a.allergens}</span> -{" "}
                      {a.reactions}{" "}
                      <span className="text-xs text-blue-600">
                        ({a.severity})
                      </span>
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
