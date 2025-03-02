"use client";

import { useState, useEffect } from "react";

const HackathonPage = () => {
  const [hackathons, setHackathons] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHackathons = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/hackathons");
        const data = await response.json();
        console.log(data);
        if (!response.ok)
          throw new Error(data.message || "Failed to fetch hackathons");
        setHackathons(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchHackathons();
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#7DA67D]">
      <div className="w-[800px] p-6 shadow- -2xl bg-[#7DA67D] border-none text-center">
        <h2 className="text-white text-[64px] font-normal font-['Jua']">
          Upcoming Hackathons
        </h2>
        <p className="text-white mb-6">Find your next hackathon event.</p>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <ul className="space-y-4">
          {hackathons.map(
            (hackathon: any) => (
              console.log(hackathon.hackathonImage),
              (
                <li
                  key={hackathon._id}
                  className="flex justify-center text-center bg-[#AFC9AF] p-4 rounded-lg text-gray-900"
                >
                  <div data-svg-wrapper>
                    <svg
                      width="240"
                      height="294"
                      viewBox="0 0 240 294"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Background path */}
                      <path
                        d="M0 20C0 8.9543 8.95431 0 20 0H220C231.046 0 240 8.95431 240 20V274C240 285.046 231.046 294 220 294H20C8.9543 294 0 285.046 0 274V20Z"
                        fill="#A3CC5C"
                        fill-opacity="0.4"
                      />
                      {/* Image Placeholder */}
                      <image
                        href={hackathon.hackathonImage} // URL of the placeholder image
                        x="50" // X position (centered horizontally)
                        y="20" // Y position (top of the box)
                        width="140" // Width of the image
                        height="140" // Height of the image
                      />
                      {hackathon.hackathonImage}
                      {/* Hackathon Name */}
                      <text
                        x="50%" // Center horizontally
                        y="180" // Position below the image
                        text-anchor="middle" // Center the text
                        fill="black" // Text color
                        font-family="Jua, sans-serif" // Font family
                        font-size="24" // Font size
                        font-weight="normal" // Font weight
                      >
                        {hackathon.hackathonName}
                      </text>
                      {/* Location */}
                      <text
                        x="50%"
                        y="210" // Position below the hackathon name
                        text-anchor="middle"
                        fill="black"
                        font-family="Jua, sans-serif"
                        font-size="18"
                      >
                        {hackathon.location}
                      </text>
                      {/* Date */}
                      <text
                        x="50%"
                        y="240" // Position below the location
                        text-anchor="middle"
                        fill="black"
                        font-family="Jua, sans-serif"
                        font-size="18"
                      >
                        {new Date(hackathon.hackathonDate).toLocaleDateString()}
                      </text>
                    </svg>
                  </div>
                </li>
              )
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default HackathonPage;
