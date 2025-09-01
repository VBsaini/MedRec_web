"use client";
import RequireAuth from "../RequireAuth";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Replace with actual userId logic as needed
  const { userId: ctxUserId } = useAuth();
  const userId =
    ctxUserId ||
    (typeof window !== "undefined" ? localStorage.getItem("userId") : null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `http://localhost:3000/api/records/user/${userId}/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError("Could not load profile");
      }
      setLoading(false);
    }
    if (userId && token) fetchProfile();
  }, [userId, token]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch(
        `http://localhost:3000/api/records/user/${userId}/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profile),
        }
      );
      if (!res.ok) throw new Error("Update failed");
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Could not update profile");
    }
  };

  return (
    <RequireAuth>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-lg border border-blue-100">
          <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            User Profile
          </h1>
          {loading ? (
            <div className="text-blue-500 text-center">Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                name="name"
                value={profile?.name || ""}
                onChange={handleChange}
                placeholder="Name"
                className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-blue-50 rounded"
              />
              <input
                name="age"
                value={profile?.age || ""}
                onChange={handleChange}
                placeholder="Age"
                type="number"
                className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-blue-50 rounded"
              />
              <input
                name="gender"
                value={profile?.gender || ""}
                onChange={handleChange}
                placeholder="Gender"
                className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-blue-50 rounded"
              />
              <input
                name="blood_group"
                value={profile?.blood_group || ""}
                onChange={handleChange}
                placeholder="Blood Group"
                className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-blue-50 rounded"
              />
              <input
                name="height"
                value={profile?.height || ""}
                onChange={handleChange}
                placeholder="Height (cm)"
                type="number"
                className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-blue-50 rounded"
              />
              <input
                name="weight"
                value={profile?.weight || ""}
                onChange={handleChange}
                placeholder="Weight (kg)"
                type="number"
                className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-blue-50 rounded"
              />
              {success && (
                <div className="text-green-600 text-center">{success}</div>
              )}
              {error && <div className="text-red-500 text-center">{error}</div>}
              {!profile && !loading && (
                <div className="flex justify-center mb-4">
                  <a
                    href="/complete-profile"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Complete Profile
                  </a>
                </div>
              )}

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
