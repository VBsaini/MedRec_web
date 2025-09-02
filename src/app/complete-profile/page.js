"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompleteProfilePage() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/records/user/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            age: age ? Number(age) : undefined,
            gender,
            blood_group: bloodGroup,
            height: height ? Number(height) : undefined,
            weight: weight ? Number(weight) : undefined,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setSuccess("Profile updated successfully!");
        setTimeout(() => router.push("/profile"), 1500);
      } else {
        setError(data.message || "Update failed");
      }
    } catch (err) {
      setError("Network error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Blood Group"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Height (cm)"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          className="border p-2 rounded"
        />
        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
