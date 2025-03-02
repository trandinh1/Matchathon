"use client";

import { useState, useEffect } from "react";

type Hackathon = {
  id: string;
  name: string;
};

const HackathonTabs = () => {
  const [attendedHackathons, setAttendedHackathons] = useState<Hackathon[]>([]);
  const [selectedHackathon, setSelectedHackathon] = useState<string | null>(null);
  const [teams, setTeams] = useState<string[]>([]);

  // 🔹 Fetch hackathons the user is attending
  useEffect(() => {
    const fetchAttendedHackathons = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/hackathons");
        const data = await response.json();
        if (!response.ok) throw new Error("Failed to fetch hackathons");
        setAttendedHackathons(data);
        if (data.length > 0) setSelectedHackathon(data[0].id); // Default to first hackathon
      } catch (error) {
        console.error("Error fetching attended hackathons:", error);
      }
    };

    fetchAttendedHackathons();
  }, []);

  // 🔹 Fetch teams when a new hackathon is selected
  useEffect(() => {
    if (!selectedHackathon) return;

    const fetchTeams = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/teams?hackathonId=${selectedHackathon}`);
        const data = await response.json();
        if (!response.ok) throw new Error("Failed to fetch teams");
        setTeams(data);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    };

    fetchTeams();
  }, [selectedHackathon]);

  return (
    <div className="w-full">
      {/* 🔹 Tab Bar */}
      <div className="flex space-x-4 bg-[#E5F4E3] p-3 rounded-lg shadow-md">
        {attendedHackathons.map((hackathon) => (
          <button
            key={hackathon.id}
            onClick={() => setSelectedHackathon(hackathon.id)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedHackathon === hackathon.id ? "bg-green-500 text-white shadow-lg" : "bg-gray-200 text-gray-700"
            }`}
          >
            {hackathon.name}
          </button>
        ))}
      </div>

      {/* 🔹 Team List for Selected Hackathon */}
      <div className="mt-6">
        <h2 className="text-xl font-bold">Teams for {attendedHackathons.find((h) => h.id === selectedHackathon)?.name}</h2>
        <ul className="mt-3 space-y-2">
          {teams.length > 0 ? (
            teams.map((team, index) => (
              <li key={index} className="bg-green-200 p-3 rounded-md shadow">
                {team}
              </li>
            ))
          ) : (
            <p className="text-gray-500">No teams yet. Join or create one!</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HackathonTabs;
