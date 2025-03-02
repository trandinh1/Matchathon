"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { useSearchParams } from "next/navigation";

const HackathonPage = () => {
  const [hackathons, setHackathons] = useState([]);
  const [attending, setAttending] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState("");
  
  // 🔹 Get email from URL & decode it properly
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ? decodeURIComponent(searchParams.get("email")!) : "";

  // 🔹 Fetch Hackathon Data
  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/hackathons");
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch hackathons");
        setHackathons(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchHackathons();
  }, []);

  // 🔹 Toggle Attendance
  const handleToggleAttendance = (id: string) => {
    setAttending((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle true/false
    }));
  };

  return (
    <div className="flex min-h-screen bg-[#7DA67D]">
      {/* 🔹 Navbar Positioned on the Left */}
      <Navbar />

      {/* 🔹 Main Content (Hackathon Grid) */}
      <div className="flex flex-col items-center justify-center flex-grow p-10">
        <h2 className="text-white text-[48px] font-normal font-['Jua'] mb-4">
          Upcoming Hackathons
        </h2>
        <p className="text-white mb-6 text-lg">Find your next hackathon event.</p>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-6">
          {hackathons.map((hackathon: any) => (
            <div key={hackathon._id} className="bg-[#AFC9AF] p-6 rounded-xl text-center shadow-lg w-[280px]">
              <div data-svg-wrapper>
                <svg width="240" height="294" viewBox="0 0 240 294" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Background */}
                  <path
                    d="M0 20C0 8.9543 8.95431 0 20 0H220C231.046 0 240 8.95431 240 20V274C240 285.046 231.046 294 220 294H20C8.9543 294 0 285.046 0 274V20Z"
                    fill="#A3CC5C"
                    fillOpacity="0.4"
                  />
                  {/* Image */}
                  <image href={hackathon.hackathonImage} x="50" y="20" width="140" height="140" />
                  {/* Hackathon Name */}
                  <text x="50%" y="180" textAnchor="middle" fill="black" fontFamily="Jua, sans-serif" fontSize="24">
                    {hackathon.hackathonName}
                  </text>
                  {/* Location */}
                  <text x="50%" y="210" textAnchor="middle" fill="black" fontFamily="Jua, sans-serif" fontSize="18">
                    {hackathon.location}
                  </text>
                  {/* Date */}
                  <text x="50%" y="240" textAnchor="middle" fill="black" fontFamily="Jua, sans-serif" fontSize="18">
                    {new Date(hackathon.hackathonDate).toLocaleDateString()}
                  </text>
                </svg>
              </div>
              {/* Attend Button */}
              <button
                onClick={() => handleToggleAttendance(hackathon._id)}
                className={`mt-4 px-4 py-2 rounded-lg shadow-md transition-all ${
                  attending[hackathon._id] ? "bg-gray-400 text-white" : "bg-green-500 text-white"
                }`}
              >
                {attending[hackathon._id] ? "Cancel Attendance" : "I'm Attending!"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HackathonPage;
