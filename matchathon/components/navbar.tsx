"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, MessageCircle, Coffee, Users, Calendar, LogOut } from "lucide-react";

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
            const matchedResponse = await fetch(`http://localhost:5001/api/profile/${userEmail}`);
            const userData = await matchedResponse.json();
    
            if (!userData.matchedWith || userData.matchedWith.length === 0) {
                console.log("No mutual matches found");
                router.push(`/team?email=${encodeURIComponent(userEmail)}`);
                return;
            }
    
            // Loop through matched users and check if they have also matched back
            for (const matchedUser of userData.matchedWith) {
                const checkMatchResponse = await fetch("http://localhost:5001/api/match/check-match", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user1: userEmail, user2: matchedUser }),
                });
    
                const checkMatchData = await checkMatchResponse.json();
                console.log(`Checking match with ${matchedUser}:`, checkMatchData.message);
            }
    
            // Navigate to team page
            router.push(`/team?email=${encodeURIComponent(userEmail)}`);
        } catch (error) {
            console.error("Error checking match:", error);
        }
    };
    
    

    return (
        <nav className="w-[250px] min-w-[250px] max-w-[250px] h-screen p-4 bg-[#d3e8c8] flex flex-col justify-between rounded-bl-[13px] shadow-lg">
            <div className="flex flex-col space-y-2 items-center">
                <img src="/matcha_logo.png" alt="Matchathon Logo" className="w-24 h-24 rounded-full" />
                <h1 className="text-2xl font-bold text-white">Matchathon</h1>
                <div className="w-[184px] h-64 flex-col justify-center items-start gap-1 flex">
                    <div className="w-[184px] h-12 p-3 bg-[#f1f9ef] p-3 rounded-md shadow-sm hover:bg-green-200">
                        <Link href="/profile" className="flex items-center gap-3">
                            <User size={20} />
                            <div className="text-lg font-semibold text-black">
                               Profile 
                            </div>
                        </Link>
                    </div>

                    <div 
                        className="w-[184px] h-12 p-3 bg-[#f1f9ef] p-3 rounded-md shadow-sm hover:bg-green-200"
                        onClick={handleTeamClick}
                    >
                        <div className="flex items-center gap-3">
                            <Coffee size={20} />
                            <span className="text-lg font-semibold text-black">Team</span>
                        </div>
                    </div>

                    <div className="w-[184px] h-12 p-3 bg-[#f1f9ef] p-3 rounded-md shadow-sm hover:bg-green-200">
                        <Link href="/hackathon" className="flex items-center gap-3" >
                        <Calendar size={20} />
                            <div className="text-lg font-semibold text-black">
                               Hackathons
                            </div>
                        </Link>
                    </div>

                    <div className="w-[184px] h-12 p-3 bg-[#f1f9ef] p-3 rounded-md shadow-sm hover:bg-green-200">
                        {userEmail ? (
                            <Link href={`/match?email=${encodeURIComponent(userEmail)}`} className="flex items-center gap-3" >
                            <Users  size={20} />
                                <div className="text-lg font-semibold text-black">
                                   MatchaGround
                                </div>
                            </Link>
                        ) : (
                            <span className="text-gray-400 text-2xl font-bold">MatchGround</span>
                        )}
                    </div>

                    <div className="w-[184px] h-12 p-3 bg-[#f1f9ef] p-3 rounded-md shadow-sm hover:bg-green-200">
                        <Link href="/messages" className="flex items-center gap-3" >
                        <MessageCircle size={20} />
                            <div className="text-lg font-semibold text-black">
                               Messages
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};
