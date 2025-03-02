"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/navbar";

type Chat = {
  id: number;
  name: string;
  message: string;
  avatar: string;
  time: string;
};

// 🔹 Hardcoded messages for each hackathon
const chatsByHackathon: { [key: string]: Chat[] } = {
  "LA Hacks": [
    { id: 1, name: "Alice", message: "What tech stack are you using?", avatar: "👩🏻", time: "11:00 am" },
    { id: 2, name: "Bob", message: "How’s your project coming along?", avatar: "👩🏼", time: "10:50 am" },
    { id: 3, name: "Charlie", message: "Does anyone want to pair program?", avatar: "👩🏽", time: "10:00 am" },
    { id: 4, name: "Diana", message: "What’s the most innovative project idea here?", avatar: "👩🏾", time: "9:45 am" },
    { id: 5, name: "Eve", message: "How do we improve AI ethics in hackathons?", avatar: "👩🏿", time: "9:15 am" },
    { id: 6, name: "Frank", message: "Who wants to brainstorm over coffee?", avatar: "👨🏼", time: "9:15 am" },
  ],
  "Hack the Future": [
    { id: 7, name: "Leah", message: "What’s the most innovative project idea here?", avatar: "👩🏾", time: "9:45 am" },
    { id: 8, name: "Taylor", message: "How do we improve AI ethics in hackathons?", avatar: "👩🏿", time: "9:15 am" },
    { id: 9, name: "Rick", message: "Who wants to brainstorm over coffee?", avatar: "👨🏼", time: "8:45 am" },
    { id: 10, name: "Dan", message: "What’s the most innovative project idea here?", avatar: "👩🏾", time: "8:45 am" },
    { id: 11, name: "Ariel", message: "How do we improve AI ethics in hackathons?", avatar: "👩🏿", time: "2:15 am" },
    { id: 12, name: "Frank", message: "Who wants to brainstorm over coffee?", avatar: "👨🏼", time: "1:45 am" },
  ],
};

const TeaChat: React.FC = () => {
  const searchParams = useSearchParams();
  const encodedEmail = searchParams.get("email");
  const email = encodedEmail ? decodeURIComponent(encodedEmail) : null; // Decode email

  const [hackathons, setHackathons] = useState<string[]>([]);
  const [selectedHackathon, setSelectedHackathon] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch User's Hacklist from Backend
  useEffect(() => {
    if (!email) return;

    const fetchHacklist = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/profile/${email}`);
        const data = await response.json();
        if (!response.ok) throw new Error("Failed to fetch user hacklist");

        if (data.hacklist && data.hacklist.length > 0) {
          setHackathons(data.hacklist);
          setSelectedHackathon(data.hacklist[0]); // Default to first attended hackathon
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHacklist();
  }, [email]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Navbar />

      {/* Chat Section */}
      <div className="flex flex-col w-full p-5 bg-white">
        <h1 className="text-2xl font-bold mb-5">Tea Chat</h1>

        {/* 🔹 Hackathon Tabs (from `hacklist`) */}
        <div className="flex space-x-4 bg-[#E5F4E3] p-3 rounded-lg shadow-md">
          {loading ? (
            <p className="text-gray-500">Loading hackathons...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : hackathons.length > 0 ? (
            hackathons.map((hackathon) => (
              <button
                key={hackathon}
                onClick={() => setSelectedHackathon(hackathon)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  selectedHackathon === hackathon ? "bg-green-500 text-white shadow-lg" : "bg-gray-200 text-gray-700"
                }`}
              >
                {hackathon}
              </button>
            ))
          ) : (
            <p className="text-gray-500">No hackathons found.</p>
          )}
        </div>

        {/* 🔹 Chat Messages */}
        <div className="space-y-3 mt-5">
          {selectedHackathon && chatsByHackathon[selectedHackathon] ? (
            chatsByHackathon[selectedHackathon].map((chat) => (
              <div key={chat.id} className="flex items-center p-3 border rounded-lg shadow">
                <span className="text-2xl mr-3">{chat.avatar}</span>
                <div className="flex-1">
                  <h2 className="font-bold">{chat.name}</h2>
                  <p className="text-gray-600">{chat.message}</p>
                </div>
                <span className="text-gray-500 text-sm">{chat.time}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Select a hackathon to view messages.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeaChat;
