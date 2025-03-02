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

const chats: Chat[] = [
   { id: 1, name: "Alice", message: "If your coding style was a tea, which would it be?", avatar: "👩🏻", time: "9:30 am" },
   { id: 2, name: "Bob", message: "What’s your favorite hackathon project idea?", avatar: "👩🏼", time: "9:30 am" },
   { id: 3, name: "Charlie", message: "What’s your go-to coding snack?", avatar: "👩🏽", time: "9:30 am" },
   { id: 4, name: "Diana", message: "If your coding style was a tea, which would it be?", avatar: "👩🏾", time: "9:30 am" },
   { id: 5, name: "Eve", message: "What tech stack do you love working with?", avatar: "👩🏿", time: "9:30 am" },
 ];

 
const TeaChat: React.FC = () => {
  const searchParams = useSearchParams();
  const encodedEmail = searchParams.get("email");
  const email = encodedEmail ? decodeURIComponent(encodedEmail) : null; // Decode email

//   const [chats, setChats] = useState<Chat[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!email) return; // Don't fetch if email is missing

//     const fetchChats = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const response = await fetch(`http://localhost:5001/api/messages?email=${email}`);
//         if (!response.ok) throw new Error("Messages not found");
//         const data = await response.json();
//         setChats(data);
//       } catch (err: any) {
//         setError(err.message);
//         setChats([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChats();
//   }, [email]);

//   if (!email) return <div className="text-center mt-10 text-red-500">No email provided.</div>;
//   if (loading) return <div className="text-center mt-10">Loading messages...</div>;
//   if (error) return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
//   if (chats.length === 0) return <div className="text-center mt-10 text-gray-500">No messages found.</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Navbar />

      {/* Chat List */}
      <div className="w-3/4 p-5 bg-white">
        <h1 className="text-2xl font-bold mb-5">Tea Chat</h1>
        <div className="space-y-3">
          {chats.map((chat) => (
            <div key={chat.id} className="flex items-center p-3 border rounded-lg shadow">
              <span className="text-2xl mr-3">{chat.avatar}</span>
              <div className="flex-1">
                <h2 className="font-bold">{chat.name}</h2>
                <p className="text-gray-600">{chat.message}</p>
              </div>
              <span className="text-gray-500 text-sm">{chat.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeaChat;
