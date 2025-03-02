"use client";

import { useEffect, useState } from "react";
import { HeartIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface MatchProfileProps {
  userEmail: string;
}

interface User {
  email: string;
  firstName: string;
  lastName: string;
  location: string;
  affiliatedWith: string;
  linkedin: string;
  aboutMe: string;
  skills: string[];
  interests: string[];
  hacklist: string[];
}

const MatchProfile: React.FC<MatchProfileProps> = ({ userEmail }) => {
  const [match, setMatch] = useState<User | null>(null);
  const [overlappingHackathon, setOverlappingHackathon] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMatch = async () => {
    try {
      // Step 1: Get the matched user's email from the backend
      const response = await fetch(`http://localhost:5001/api/match/${userEmail}`);
      const data = await response.json();

      if (data.message || !data.email) {
        setError("No match found");
        return;
      }

      // Step 2: Fetch the matched user's full details from MongoDB
      const userResponse = await fetch(`http://localhost:5001/api/profile/${data.email}`);
      const userData = await userResponse.json();

      // Step 3: Fetch the logged-in user's hackathon list
      const originalUserResponse = await fetch(`http://localhost:5001/api/profile/${userEmail}`);
      const originalUserData = await originalUserResponse.json();
      const originalHackathons = originalUserData.hacklist || [];

      // Step 4: Find overlapping hackathons
      const overlap = userData.hacklist.find((hack) => originalHackathons.includes(hack));

      setMatch(userData);
      setOverlappingHackathon(overlap || "No common hackathon found");
    } catch (error) {
      setError("Error fetching match data");
    }
  };

  useEffect(() => {
    fetchMatch();
  }, [userEmail]);

  const handleMatchAction = async (action: "like" | "dislike") => {
    if (!match) return;

    try {
      await fetch("http://localhost:5001/api/match/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail, matchedEmail: match.email, action }),
      });

      // Fetch next match after action
      fetchMatch();
    } catch (error) {
      console.error("Error updating match:", error);
    }
  };

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!match) {
    return <p className="text-gray-600 text-center">Loading match...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-xl p-6 w-[600px] flex">
        {/* Left: Profile Image */}
        <div className="flex flex-col items-center">
          <img
            src={`/images/image${Math.floor(Math.random() * 3) + 1}.jpg`}
            alt={match.firstName}
            className="w-40 h-40 rounded-full border-4 border-white shadow-md"
          />
          <a href={match.linkedin} target="_blank" rel="noopener noreferrer">
            <img src="/linkedin-icon.png" alt="LinkedIn" className="w-8 h-8 mt-2" />
          </a>
        </div>

        {/* Right: User Details */}
        <div className="ml-6">
          <h2 className="text-2xl font-bold">{match.firstName} {match.lastName}</h2>
          <p className="text-gray-600">{match.affiliatedWith}, {match.location}</p>

          {/* Skills */}
          <div className="mt-3 flex flex-wrap gap-2">
            {match.skills.map((skill, index) => (
              <span key={index} className="bg-green-200 px-2 py-1 rounded-full text-sm font-semibold">
                {skill}
              </span>
            ))}
          </div>

          {/* Interests */}
          <div className="mt-3 flex flex-wrap gap-2">
            {match.interests.map((interest, index) => (
              <span key={index} className="bg-blue-200 px-2 py-1 rounded-full text-sm font-semibold">
                {interest}
              </span>
            ))}
          </div>

          {/* About Me */}
          <p className="mt-3 text-gray-700 text-sm">
            <strong>About Me:</strong> {match.aboutMe}
          </p>

          {/* Overlapping Hackathon */}
          <p className="mt-3 text-sm text-gray-700">
            <strong>Matched for:</strong> {overlappingHackathon}
          </p>

          {/* Buttons */}
          <div className="flex justify-between mt-5">
            <button className="bg-red-100 p-3 rounded-full" onClick={() => handleMatchAction("dislike")}>
              <XCircleIcon className="w-8 h-8 text-red-600" />
            </button>
            <button className="bg-green-100 p-3 rounded-full" onClick={() => handleMatchAction("like")}>
              <HeartIcon className="w-8 h-8 text-green-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchProfile;
