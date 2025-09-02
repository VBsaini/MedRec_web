"use client";
import RequireAuth from "../RequireAuth";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";

export default function MedicationsPage() {
  const { token } = useAuth();
  const [availableMedications, setAvailableMedications] = useState([]);
  const [medications, setMedications] = useState([]);
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    prescribedBy: "",
    prescribedFor: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchAvailableMedications() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/records/all-medications`
        );
        if (!res.ok) throw new Error("Failed to fetch available medications");
        const data = await res.json();
        setAvailableMedications(Array.isArray(data) ? data : []);
      } catch (err) {
        // ignore
      }
    }
    fetchAvailableMedications();
  }, []);

  const { userId: ctxUserId } = useAuth();
  const userId =
    ctxUserId ||
    (typeof window !== "undefined" ? localStorage.getItem("userId") : null);

  useEffect(() => {
    async function fetchMedications() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/records/medication/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch medications");
        const data = await res.json();
        setMedications(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Could not load medications");
      }
      setLoading(false);
    }
    if (userId && token) fetchMedications();
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/records/medication/${userId}`,
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
      setSuccess("Medication added!");
      setForm({
        name: "",
        dosage: "",
        frequency: "",
        prescribedBy: "",
        prescribedFor: "",
        startDate: "",
        endDate: "",
      });
      // Refresh list
      const data = await res.json();
      setMedications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Could not add medication");
    }
  };

  return (
    <RequireAuth>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg border border-blue-100">
          <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Medications
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
                    .getElementById("medication-form")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
              >
                Add Medication
              </button>
            </div>
          ) : (
            <>
              <form
                id="medication-form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 mb-6"
              >
                <select
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="border p-2 rounded"
                  required
                >
                  <option value="">Select Medication</option>
                  {availableMedications.map((med) => (
                    <option key={med._id} value={med.name}>
                      {med.name}
                    </option>
                  ))}
                </select>
                <input
                  name="dosage"
                  value={form.dosage}
                  onChange={handleChange}
                  placeholder="Dosage"
                  className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-gray-900 placeholder-gray-500"
                  style={{ color: "#222", background: "#fff" }}
                />
                <input
                  name="frequency"
                  value={form.frequency}
                  onChange={handleChange}
                  placeholder="Frequency"
                  className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-gray-900 placeholder-gray-500"
                  style={{ color: "#222", background: "#fff" }}
                />
                <input
                  name="prescribedBy"
                  value={form.prescribedBy}
                  onChange={handleChange}
                  placeholder="Prescribed By"
                  className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-gray-900 placeholder-gray-500"
                  style={{ color: "#222", background: "#fff" }}
                />
                <input
                  name="prescribedFor"
                  value={form.prescribedFor}
                  onChange={handleChange}
                  placeholder="Prescribed For"
                  className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-gray-900 placeholder-gray-500"
                  style={{ color: "#222", background: "#fff" }}
                />
                <input
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  placeholder="Start Date"
                  type="date"
                  className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-gray-900 placeholder-gray-500"
                  style={{ color: "#222", background: "#fff" }}
                />
                <input
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  placeholder="End Date"
                  type="date"
                  className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-gray-900 placeholder-gray-500"
                  style={{ color: "#222", background: "#fff" }}
                />
                {success && (
                  <div className="text-green-600 text-center">{success}</div>
                )}
                {error && (
                  <div className="text-red-500 text-center">{error}</div>
                )}
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-green-400 text-white font-semibold p-2 rounded shadow hover:from-blue-600 hover:to-green-500 transition"
                >
                  Add Medication
                </button>
              </form>
              <div>
                <h2 className="text-lg font-semibold text-blue-600 mb-2">
                  Your Medications
                </h2>
                <ul className="space-y-2">
                  {medications.length === 0 && (
                    <li className="text-gray-500 flex flex-col items-center gap-3">
                      <span>
                        No data yet. Click Add to create your first entry.
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          document
                            .getElementById("medication-form")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Add Medication
                      </button>
                    </li>
                  )}
                  {medications.map((med) => (
                    <li key={med._id} className="border p-2 rounded bg-blue-50">
                      <div className="font-semibold">{med.name}</div>
                      <div className="text-sm text-gray-700">
                        Dosage: {med.dosage}
                      </div>
                      <div className="text-sm text-gray-700">
                        Frequency: {med.frequency}
                      </div>
                      <div className="text-sm text-gray-700">
                        Prescribed By: {med.prescribedBy}
                      </div>
                      <div className="text-sm text-gray-700">
                        Prescribed For: {med.prescribedFor}
                      </div>
                      <div className="text-sm text-gray-700">
                        Start Date: {med.startDate}
                      </div>
                      <div className="text-sm text-gray-700">
                        End Date: {med.endDate}
                      </div>
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
