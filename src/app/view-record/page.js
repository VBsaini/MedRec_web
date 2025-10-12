"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function UserDataPage() {
  const [userData, setUserData] = useState(null);
  const [visitorData, setVisitorData] = useState({
    name: "",
    purpose: "routine visit",
    anonymous: false,
    anonymousName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cardId, setCardId] = useState("");
  const [showVisitorForm, setShowVisitorForm] = useState(true);
  const [visitorSubmitted, setVisitorSubmitted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlCardId = searchParams.get("card_id");
    if (urlCardId) {
      setCardId(urlCardId);
      setShowVisitorForm(true);
    }
  }, [searchParams]);

  const handleVisitorSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Get IP address (simplified - in production use a proper service)
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();

      const visitorPayload = {
        name: visitorData.anonymous
          ? visitorData.anonymousName
          : visitorData.name,
        purpose: visitorData.purpose,
        card_Id: cardId,
        ip_address: ipData.ip || "unknown",
        anonymous: {
          status: visitorData.anonymous,
          name: visitorData.anonymous ? visitorData.anonymousName : null,
        },
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/records/visitor`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(visitorPayload),
        }
      );

      if (!res.ok) throw new Error("Failed to register visitor");

      setVisitorSubmitted(true);
      setShowVisitorForm(false);

      // Now fetch user data
      await fetchUserData();
    } catch (err) {
      setError("Could not register visitor access");
    }
    setLoading(false);
  };

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/records/user/card/${cardId}`
      );

      if (!res.ok) throw new Error("User not found");

      const data = await res.json();
      setUserData(data);
    } catch (err) {
      setError("Could not load user data. Please check the card ID.");
    }
    setLoading(false);
  };

  const handleVisitorChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVisitorData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (showVisitorForm && !visitorSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-green-100">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-blue-100">
          <h1 className="text-2xl font-bold text-blue-700 mb-6 text-center">
            Medical Record Access
          </h1>
          <p className="text-center text-gray-600 mb-4">
            Card ID: <strong>{cardId}</strong>
          </p>

          <form onSubmit={handleVisitorSubmit} className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="anonymous"
                checked={visitorData.anonymous}
                onChange={handleVisitorChange}
                className="w-4 h-4"
              />
              <label className="text-sm">Access as Anonymous</label>
            </div>

            {visitorData.anonymous ? (
              <input
                name="anonymousName"
                value={visitorData.anonymousName}
                onChange={handleVisitorChange}
                placeholder="Anonymous Name"
                className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-black"
                required
              />
            ) : (
              <input
                name="name"
                value={visitorData.name}
                onChange={handleVisitorChange}
                placeholder="Your Full Name"
                className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-black"
                required
              />
            )}

            <select
              name="purpose"
              value={visitorData.purpose}
              onChange={handleVisitorChange}
              className="border-b-2 border-blue-200 focus:border-blue-500 p-2 outline-none bg-white rounded text-black"
              required
            >
              <option value="routine visit">Routine Visit</option>
              <option value="emergency">Emergency</option>
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
            </select>

            {error && (
              <div className="text-red-500 text-center text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="cool-button text-white font-semibold p-3 rounded shadow hover:from-blue-600 hover:to-green-500 transition disabled:opacity-50"
            >
              {loading ? "Accessing..." : "Access Medical Record"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-blue-500 text-xl">Loading medical records...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-center mb-4">{error}</div>
        <button
          onClick={() => setShowVisitorForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow-lg rounded-xl p-8 border border-blue-100">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-700 mb-2">
              Medical Record
            </h1>
            <p className="text-gray-600">Card ID: {userData.card_Id}</p>
          </div>

          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">
                Personal Information
              </h2>
              <div className="space-y-2 text-black">
                <p>
                  <strong>Name:</strong> {userData.name}
                </p>
                <p>
                  <strong>Age:</strong> {userData.age}
                </p>
                <p>
                  <strong>Gender:</strong> {userData.gender}
                </p>
                <p>
                  <strong>Blood Group:</strong> {userData.blood_group}
                </p>
                <p>
                  <strong>Height:</strong> {userData.height} cm
                </p>
                <p>
                  <strong>Weight:</strong> {userData.weight} kg
                </p>
              </div>
            </div>

            {/* Health Conditions */}
            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-green-600 mb-4">
                Health Conditions
              </h2>
              <div className="space-y-2 text-black">
                <p>
                  <strong>Diabetic:</strong>{" "}
                  {userData.diabetic?.status
                    ? `Yes (${userData.diabetic.type})`
                    : "No"}
                </p>
                <p>
                  <strong>Heart Condition:</strong>{" "}
                  {userData.heart?.status ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Mental Health:</strong>{" "}
                  {userData.mental_health?.status ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          {/* Medical History */}
          {userData.medical_history && userData.medical_history.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">
                Medical History
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg ">
                {userData.medical_history.map((history, index) => (
                  <div key={index} className="mb-2">
                    <p className="text-black">{history.past_illnesses}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Allergies */}
          {userData.allergies && userData.allergies.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-red-600 mb-4">
                Allergies
              </h2>
              <div className="grid gap-4">
                {userData.allergies.map((allergy, index) => (
                  <div
                    key={index}
                    className="bg-red-50 p-4 text-black rounded-lg border border-red-200"
                  >
                    <p>
                      <strong>Allergen:</strong> {allergy.allergens}
                    </p>
                    <p>
                      <strong>Reaction:</strong> {allergy.reactions}
                    </p>
                    <p>
                      <strong>Severity:</strong>{" "}
                      <span
                        className={`font-semibold ${
                          allergy.severity === "Severe"
                            ? "text-red-600"
                            : allergy.severity === "Moderate"
                            ? "text-orange-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {allergy.severity}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency Contacts */}
          {userData.emergency_contact &&
            userData.emergency_contact.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl  font-semibold text-purple-600 mb-4">
                  Emergency Contacts
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {userData.emergency_contact.map((contact, index) => (
                    <div
                      key={index}
                      className="bg-purple-50 text-black p-4 rounded-lg"
                    >
                      <p>
                        <strong>Name:</strong> {contact.name}
                      </p>
                      <p>
                        <strong>Relationship:</strong> {contact.relationship}
                      </p>
                      <p>
                        <strong>Phone:</strong> {contact.phone_number}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Family History */}
          {userData.family_history && userData.family_history.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-indigo-600 mb-4">
                Family History
              </h2>
              <div className="space-y-4">
                {userData.family_history.map((family, index) => (
                  <div
                    key={index}
                    className="bg-indigo-50 text-black p-4 rounded-lg"
                  >
                    <p>
                      <strong>{family.relationship}:</strong>{" "}
                      {family.conditions}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-8 pt-4 border-t">
            <p className="text-sm text-gray-500">
              Access logged on {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
