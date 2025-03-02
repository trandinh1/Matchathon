'use client';

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { useSearchParams } from "next/navigation";

const ProfilePage = () => {
 // Default email, replace dynamically if needed
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams(); 
  const email = searchParams.get("email");
  const randomImageNumber = Math.floor(Math.random() * 3) + 1;
  const imageSrc = `/images/image${randomImageNumber}.jpg`;

  const router = useRouter();

  useEffect(() => {
    if (!email) return; // Prevent fetch if email is empty

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5001/api/profile/${email}`);
        if (!response.ok) throw new Error("User not found");
        const data = await response.json();
        setUser(data);
      } catch (error: any) {
        setError(error.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [email]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!user) return <div className="text-gray-500">No user data found</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col w-full items-center p-6">
        <div className="w-3/4 bg-green-100 p-6 rounded-xl shadow-lg text-align: left">
        <img
            src={imageSrc}
            alt={user.firstName || "User"}
            className="w-40 h-40 rounded-full border-4 border-white shadow-md mr-6"
          />
          <div>
            <h2 className="text-black text-2xl font-normal font-['Jua']">{user.firstName || "First Name"} {user.lastName || "Last Name"}</h2>
            <p className="text-black text-2xl font-normal font-['Jua']">{user.email || "No email provided"}</p>
            <p className="text-black text-2xl font-normal font-['Jua']">{user.location || "N/A"}</p>
            <p className="text-black text-2xl font-normal font-['Jua']">{user.affiliatedWith || "N/A"}</p>
            <p className="text-black text-2xl font-normal font-['Jua']">{user.linkedin || ""}</p>
          </div>
        </div>
        <div className="w-3/4 mt-6 p-6 bg-green-100 rounded-xl shadow-md">
          <h3 className="text-2xl text-black font-bold">About Me</h3>
          <p className="text-gray-700 mt-2">{user.aboutMe || "No about me information available"}</p>
        </div>
        <div className="w-3/4 grid grid-cols-2 gap-6 mt-6">
          <div className="p-6 bg-green-100 rounded-xl shadow-md">
            <h3 className="text-lg text-black font-bold">Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.skills?.length > 0 ? (
                user.skills.map((skill, index) => (
                  <span key={index} className="bg-green-300 px-3 py-1 rounded-xl text-sm text-white font-semibold">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">No skills added</p>
              )}
            </div>
          </div>
          <div className="p-6 bg-green-100 rounded-xl shadow-md">
            <h3 className="text-lg text-black font-bold">Interests</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.interests?.length > 0 ? (
                user.interests.map((interest, index) => (
                  <span key={index} className="bg-green-300 px-3 py-1 rounded-xl text-sm text-white font-semibold">
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500">No interests added</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
