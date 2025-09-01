"use client";
import RequireAuth from "../RequireAuth";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";

export default function EmergencyContactPage() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    relationship: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { userId: ctxUserId } = useAuth();
  const userId =
    ctxUserId ||
    (typeof window !== "undefined" ? localStorage.getItem("userId") : null);

  useEffect(() => {
    async function fetchContacts() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://localhost:3000/api/records/emergency-contact/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch contacts");
        const data = await res.json();
        setContacts(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Could not load contacts");
      }
      setLoading(false);
    }
    if (userId && token) fetchContacts();
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
        `http://localhost:3000/api/records/emergency-contact/${userId}`,
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
      setSuccess("Contact added!");
      setForm({ name: "", phone_number: "", relationship: "" });
      // Refresh list
      const data = await res.json();
      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Could not add contact");
    }
  };

  return (
    <RequireAuth>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg border border-blue-100">
          <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Emergency Contacts
          </h1>
          {loading ? (
            <div className="text-blue-500 text-center">Loading...</div>
          ) : error ? (
            <div className="flex flex-col items-center gap-4">
              <div className="text-red-500 text-center">{error}</div>
              {token && (
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById("contact-form")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Add Contact
                </button>
              )}
            </div>
          ) : (
            <>
              <form
                id="contact-form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 mb-6"
              >
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-gray-900 placeholder-gray-500"
                  style={{ color: "#222", background: "#fff" }}
                />
                <input
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-gray-900 placeholder-gray-500"
                  style={{ color: "#222", background: "#fff" }}
                />
                <input
                  name="relationship"
                  value={form.relationship}
                  onChange={handleChange}
                  placeholder="Relationship"
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
                  Add Contact
                </button>
              </form>
              <div>
                <h2 className="text-lg font-semibold text-blue-600 mb-2">
                  Your Emergency Contacts
                </h2>
                <ul className="space-y-2">
                  {contacts.length === 0 && (
                    <li className="text-gray-500 flex flex-col items-center gap-3">
                      <span>No contacts recorded.</span>
                      <button
                        type="button"
                        onClick={() =>
                          document
                            .getElementById("contact-form")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        Add Contact
                      </button>
                    </li>
                  )}
                  {contacts.map((c, i) => (
                    <li
                      key={i}
                      className="bg-blue-50 rounded p-2 border border-blue-100"
                    >
                      <span className="font-semibold">{c.name}</span> -{" "}
                      {c.phone_number}{" "}
                      <span className="text-xs text-blue-600">
                        ({c.relationship})
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
