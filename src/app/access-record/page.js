"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AccessRecordPage() {
  const [cardId, setCardId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cardId.trim()) {
      setError("Please enter a valid Card ID");
      return;
    }

    // Redirect to view-record page with card_id as query parameter
    router.push(`/view-record?card_id=${encodeURIComponent(cardId.trim())}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-blue-100">
        <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Access Medical Record
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Enter the Card ID to access medical records
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            value={cardId}
            onChange={(e) => setCardId(e.target.value)}
            placeholder="Enter Card ID (e.g., MED001)"
            className="border-b-2 border-blue-200 focus:border-blue-500 p-3 outline-none bg-white rounded text-black placeholder-gray-500 text-center text-lg font-mono"
            required
          />

          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}

          <button
            type="submit"
            className="cool-button text-white font-semibold p-3 rounded shadow hover:from-blue-600 hover:to-green-500 transition"
          >
            Access Records
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            For emergency access, please contact medical staff
          </p>
        </div>
      </div>
    </div>
  );
}
