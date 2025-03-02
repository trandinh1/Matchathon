"use client";

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
        const response = await fetch(
          `http://localhost:5001/api/profile/${email}`
        );
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
    <div className="flex h-screen bg-[#f1f9ef]">
      <Navbar />
      <div className="flex flex-col w-full items-center p-6">
        <div className="w-3/4 bg-white p-6 rounded-xl shadow-lg flex items-center">
          <img
            src={imageSrc}
            alt={user.firstName || "User"}
            className="w-40 h-40 rounded-full border-4 border-[#3e6247] shadow-md mr-6"
          />
          <div>
            <h2 className="text-[#3e6247] text-2xl font-semibold font-['Jua']">
              {user.firstName || "First Name"} {user.lastName || "Last Name"}
            </h2>
            <p className="text-[#4f704f] text-xl font-medium">
              {user.email || "No email provided"}
            </p>
            <p className="text-[#4f704f] text-xl font-medium">
              {user.location || "N/A"}
            </p>
            <p className="text-[#4f704f] text-xl font-medium">
              {user.affiliatedWith || "N/A"}
            </p>
            <p className="text-[#4f704f] text-xl font-medium">
              {user.linkedin || ""}
            </p>
          </div>
        </div>

        <div className="w-3/4 mt-6 p-6 bg-white rounded-xl shadow-md">
          <h3 className="text-2xl text-[#3e6247] font-bold">About Me</h3>
          <p className="text-[#5a7d5a] mt-2">
            {user.aboutMe || "No about me information available"}
          </p>
        </div>

        <div className="w-3/4 grid grid-cols-2 gap-6 mt-6">
          <div className="p-6 bg-white rounded-xl shadow-md">
            <h3 className="text-lg text-[#3e6247] font-bold">Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.skills?.length > 0 ? (
                user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-red-200 px-3 py-1 rounded-xl text-sm font-semibold"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-[#789b78]">No skills added</p>
              )}
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md">
            <h3 className="text-lg text-[#3e6247] font-bold">Interests</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {user.interests?.length > 0 ? (
                user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-blue-200 px-3 py-1 rounded-xl text-sm  font-semibold"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <p className="text-sm text-[#789b78]">No interests added</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
