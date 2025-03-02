"use client";

import { useEffect, useState } from "react";

interface Hackathon {
  hackathonName: string;
  hackathonDate: string;
  location: string;
  attendees: string[];
}

export default function HackathonsPage() {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/hackathon");
        const data = await response.json();

        if (!response.ok)
          throw new Error(data.error || "Failed to fetch hackathons");

        setHackathons(data);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchHackathons();

    // ✅ Retrieve logged-in user email from localStorage
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setUserEmail(storedEmail);
  }, []);

  const handleRegister = async (hackathonName: string) => {
    if (!userEmail) {
      alert("Please log in to register for a hackathon.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5001/api/hackathon/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hackathonName, email: userEmail }),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.msg || "Failed to register");

      // ✅ Update local state to reflect the registration
      setHackathons((prev) =>
        prev.map((h) =>
          h.hackathonName === hackathonName
            ? { ...h, attendees: [...h.attendees, userEmail] }
            : h
        )
      );
    } catch (error: any) {
      alert(error.message);
    }
  };

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (hackathons.length === 0)
    return (
      <p className="text-gray-600 text-center">No hackathons available.</p>
    );

  return (
    <div className="bg-[#f1f9ef] min-h-screen flex flex-col items-center p-6">
      <h2 className="text-3xl font-bold text-[#5a7d5a] mt-6">
        Upcoming Hackathons
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {hackathons.map((hackathon) => (
          <div
            key={hackathon.hackathonName}
            className="bg-white shadow-md rounded-lg p-6 w-80 text-center border border-[#c8e6c9]"
          >
            <h3 className="text-xl font-bold text-[#3e6247]">
              {hackathon.hackathonName}
            </h3>
            <p className="text-[#6b8c6b]">{hackathon.location}</p>
            <p className="text-[#789b78]">📅 {hackathon.hackathonDate}</p>

            <button
              className={`mt-4 w-full py-2 rounded-md shadow-md text-white font-semibold transition ${
                hackathon.attendees.includes(userEmail || "")
                  ? "bg-[#7bb17e] cursor-not-allowed"
                  : "bg-[#a3cfa3] hover:bg-[#89b489]"
              }`}
              onClick={() => handleRegister(hackathon.hackathonName)}
              disabled={hackathon.attendees.includes(userEmail || "")}
            >
              {hackathon.attendees.includes(userEmail || "")
                ? "Already Attending"
                : "Attend"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
