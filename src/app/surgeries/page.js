"use client";
import RequireAuth from "../RequireAuth";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";

export default function SurgeriesPage() {
  const { token } = useAuth();
  const [surgeries, setSurgeries] = useState([]);
  const [form, setForm] = useState({
    patientName: "",
    hospitalName: "",
    doctorName: "",
    surgeryType: "",
    surgeryDate: "",
    details: "",
    recordNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    async function fetchSurgeries() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/records/surgery/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch surgeries");
        const data = await res.json();
        setSurgeries(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Could not load surgeries");
      }
      setLoading(false);
    }
    if (userId && token) fetchSurgeries();
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/records/surgery/${userId}`,
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
      setSuccess("Surgery added!");
      setForm({
        patientName: "",
        hospitalName: "",
        doctorName: "",
        surgeryType: "",
        surgeryDate: "",
        details: "",
        recordNumber: "",
      });
      // Refresh list
      const data = await res.json();
      setSurgeries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Could not add surgery");
    }
  };

  return (
    <RequireAuth>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg border border-blue-100">
          <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Surgeries
          </h1>
          {loading ? (
            <div className="text-blue-500 text-center">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 mb-6"
              >
                <input
                  name="patientName"
                  value={form.patientName}
                  onChange={handleChange}
                  placeholder="Patient Name"
                  className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-gray-900 placeholder-gray-500"
                  style={{ color: "#222", background: "#fff" }}
                />
                <input
                  name="hospitalName"
                  value={form.hospitalName}
                  onChange={handleChange}
                  placeholder="Hospital Name"
                  className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-gray-900 placeholder-gray-500"
                  style={{ color: "#222", background: "#fff" }}
                />
                <input
                  name="doctorName"
                  value={form.doctorName}
                  onChange={handleChange}
                  placeholder="Doctor Name"
                  className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-gray-900 placeholder-gray-500"
                  style={{ color: "#222", background: "#fff" }}
                />
                <input
                  name="surgeryType"
                  value={form.surgeryType}
                  onChange={handleChange}
                  placeholder="Surgery Type"
                  className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-gray-900 placeholder-gray-500"
                  style={{ color: "#222", background: "#fff" }}
                />
                <input
                  name="surgeryDate"
                  value={form.surgeryDate}
                  onChange={handleChange}
                  placeholder="Surgery Date"
                  type="date"
                  className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-gray-900 placeholder-gray-500"
                  style={{ color: "#222", background: "#fff" }}
                />
                <input
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  placeholder="Details"
                  className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-gray-900 placeholder-gray-500"
                  style={{ color: "#222", background: "#fff" }}
                />
                <input
                  name="recordNumber"
                  value={form.recordNumber}
                  onChange={handleChange}
                  placeholder="Record Number"
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
                  Add Surgery
                </button>
              </form>
              <div>
                <h2 className="text-lg font-semibold text-blue-600 mb-2">
                  Your Surgeries
                </h2>
                <ul className="space-y-2">
                  {surgeries.length === 0 && (
                    <li className="text-gray-500">No surgeries recorded.</li>
                  )}
                  {surgeries.map((s, i) => (
                    <li
                      key={i}
                      className="bg-blue-50 rounded p-2 border border-blue-100"
                    >
                      <span className="font-semibold">{s.surgeryType}</span> -{" "}
                      {s.hospitalName}{" "}
                      <span className="text-xs text-blue-600">
                        ({s.surgeryDate})
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
