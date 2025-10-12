"use client";
import RequireAuth from "../RequireAuth";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";

export default function VisitorsPage() {
  const { token } = useAuth();
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { userId: ctxUserId } = useAuth();
  const userId =
    ctxUserId ||
    (typeof window !== "undefined" ? localStorage.getItem("userId") : null);

  useEffect(() => {
    async function fetchVisitors() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/records/visitors/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch visitors");
        const data = await res.json();
        setVisitors(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Could not load visitors");
      }
      setLoading(false);
    }
    if (userId && token) fetchVisitors();
  }, [userId, token]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getPurposeColor = (purpose) => {
    switch (purpose) {
      case "emergency":
        return "text-red-600 bg-red-100";
      case "routine visit":
        return "text-blue-600 bg-blue-100";
      case "consultation":
        return "text-green-600 bg-green-100";
      case "follow-up":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <RequireAuth>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-4xl border border-blue-100">
          <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Record Access Log
          </h1>

          {loading ? (
            <div className="text-blue-500 text-center">Loading visitors...</div>
          ) : error ? (
            <div className="text-red-500 text-center">{error}</div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  Total Access Records: <strong>{visitors.length}</strong>
                </p>
              </div>

              {visitors.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No access records yet</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {visitors.map((visitor) => (
                    <div
                      key={visitor._id}
                      className="bg-gray-50 rounded-lg p-4 border"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg text-black">
                              {visitor.anonymous.status
                                ? `Anonymous (${visitor.anonymous.name})`
                                : visitor.name}
                            </h3>
                            {visitor.anonymous.status && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                ANONYMOUS
                              </span>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-2 text-sm">
                            <p className="text-black">
                              <strong>Purpose:</strong>
                              <span
                                className={`ml-2 px-2 py-1 rounded text-xs ${getPurposeColor(
                                  visitor.purpose
                                )}`}
                              >
                                {visitor.purpose}
                              </span>
                            </p>
                            <p className="text-black">
                              <strong>Access Time:</strong>{" "}
                              {formatDate(visitor.visitDate)}
                            </p>
                            <p className="text-black">
                              <strong>IP Address:</strong> {visitor.ip_address}
                            </p>
                            <p className="text-black">
                              <strong>Visitor ID:</strong> {visitor.Id}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              visitor.purpose === "emergency"
                                ? "bg-red-500 text-white"
                                : visitor.purpose === "routine visit"
                                ? "bg-blue-500 text-white"
                                : visitor.purpose === "consultation"
                                ? "bg-green-500 text-white"
                                : "bg-purple-500 text-white"
                            }`}
                          >
                            {visitor.purpose.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
