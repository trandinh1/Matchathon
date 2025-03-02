"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  MessageCircle,
  Coffee,
  Users,
  Calendar,
  LogOut,
} from "lucide-react";

export const Navbar = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const handleTeamClick = async () => {
    if (!userEmail) return;

    try {
      //  Fetch matched users from the database
      const matchedResponse = await fetch(
        `http://localhost:5001/api/profile/${userEmail}`
      );
      const userData = await matchedResponse.json();

      if (!userData.matchedWith || userData.matchedWith.length === 0) {
        console.log("No mutual matches found");
        router.push(`/team?email=${encodeURIComponent(userEmail)}`);
        return;
      }

      // Loop through matched users and check if they have also matched back
      for (const matchedUser of userData.matchedWith) {
        const checkMatchResponse = await fetch(
          "http://localhost:5001/api/match/check-match",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user1: userEmail, user2: matchedUser }),
          }
        );

        const checkMatchData = await checkMatchResponse.json();
        console.log(
          `Checking match with ${matchedUser}:`,
          checkMatchData.message
        );
      }

      // Navigate to team page
      router.push(`/team?email=${encodeURIComponent(userEmail)}`);
    } catch (error) {
      console.error("Error checking match:", error);
    }
  };

  return (
    <nav className="w-[216px] h-[832px] p-4 bg-[#effae9] rounded-bl-[13px] rounded-br-[13px] shadow-lg flex-col justify-center items-center gap-3 inline-flex overflow-hidden">
      <div className="">
        <a
          href={`/profile?email=${encodeURIComponent(userEmail)}`}
          className="text-2xl font-bold"
        >
          Profile
        </a>
        <div className="w-[184px] h-64 flex-col justify-center items-start gap-1 flex">
          <div className="w-[184px] h-12 p-3 rounded-[10px] justify-between items-center inline-flex bg-white">
            <Link
              href="/profile"
              className="text-2xl font-bold hover:text-gray-300"
            >
              Profile
            </Link>
          </div>
          <div
            className="w-[184px] h-12 p-3 rounded-[10px] justify-between items-center inline-flex bg-white cursor-pointer"
            onClick={handleTeamClick}
          >
            <span className="text-2xl font-bold hover:text-gray-300">Team</span>
          </div>
          <div className="w-[184px] h-12 p-3 rounded-[10px] justify-between items-center inline-flex bg-white">
            <Link
              href="/hackathon"
              className="text-2xl font-bold hover:text-gray-300"
            >
              Hackathons
            </Link>
          </div>
          <div className="w-[184px] h-12 p-3 rounded-[10px] justify-between items-center inline-flex bg-white">
            {userEmail ? (
              <Link
                href={`/match?email=${encodeURIComponent(userEmail)}`}
                className="text-2xl font-bold hover:text-gray-300"
              >
                MatchGround
              </Link>
            ) : (
              <span className="text-gray-400 text-2xl font-bold">
                MatchGround
              </span>
            )}
          </div>
          <div className="w-[184px] h-12 p-3 rounded-[10px] justify-between items-center inline-flex bg-white">
            <Link
              href={`/message?email=${encodeURIComponent(userEmail)}`}
              className="text-2xl font-bold hover:text-gray-300"
            >
              Messages
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
