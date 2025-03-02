"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  affiliatedWith: string;
  linkedin: string;
  skills: string[];
  interests: string[];
}

export default function TeamPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) {
      setError("No email provided");
      return;
    }

    const fetchTeam = async () => {
      try {
        //  Fetch the team members from backend
        const response = await fetch(`http://localhost:5001/api/team/${email}`);
        const data = await response.json();

        if (!response.ok)
          throw new Error(data.message || "Failed to fetch team");

        setTeamMembers(data.team);
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchTeam();
  }, [email]);

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!teamMembers.length)
    return (
      <p className="text-gray-600 text-center">You are not in a team yet.</p>
    );

  return (
    <div className="bg-[#e6f0e6] min-h-screen flex flex-col items-center">
      <h2 className="text-3xl font-bold mt-6 text-[#3e6247]">Your Team</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {teamMembers.map((member) => (
          <div
            key={member.email}
            className="bg-[#d9e8c5] shadow-lg rounded-lg p-6 w-64 text-center"
          >
            <img
              src={`/images/avatar${Math.floor(Math.random() * 3) + 1}.jpg`}
              alt={member.firstName}
              className="w-24 h-24 rounded-full mx-auto border-4 border-[#b0c9a1] shadow-md"
            />
            <h3 className="text-xl font-semibold mt-3 text-[#3e6247]">
              {member.firstName} {member.lastName}
            </h3>
            <p className="text-[#4f704f] text-sm">
              {member.affiliatedWith}, {member.location}
            </p>

            {/* Skills */}
            <div className="mt-3 flex flex-wrap gap-1 justify-center">
              {member.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-[#89b489] px-2 py-1 rounded-full text-xs text-white font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Interests */}
            <div className="mt-2 flex flex-wrap gap-1 justify-center">
              {member.interests.map((interest, index) => (
                <span
                  key={index}
                  className="bg-[#a5c8a1] px-2 py-1 rounded-full text-xs text-[#3e6247] font-semibold"
                >
                  {interest}
                </span>
              ))}
            </div>

            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block"
            >
              <img
                src="/linkedin-icon.png"
                alt="LinkedIn"
                className="w-6 h-6 mx-auto opacity-80 hover:opacity-100 transition"
              />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
