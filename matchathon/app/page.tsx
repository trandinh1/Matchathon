"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Lottie from "lottie-react";
import LoadingScreen from "@/components/LoadingScreen";

export default function Home() {
  <LoadingScreen />
  const [animationData, setAnimationData] = useState(null);

  // 🔹 Load Lottie JSON dynamically
  useEffect(() => {
    fetch("/collab.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error("Failed to load animation:", err));
  }, []);

  return (
    <div className="flex h-screen bg-[#7DA67D] items-center justify-center p-10">
      {/* Main Container */}
      <div className="w-full max-w-6xl bg-[#7DA67D] rounded-xl p-10 flex justify-between items-center relative">
        
        {/* 🔹 Logo & Name - Positioned to Upper Left */}
        {/* 🔹 Logo & Name - Properly Positioned in Upper Left */}
        {/* <div className="fixed top-10 left-10 flex items-center">
          <Image src="/matcha_logo.png" alt="Matchathon Logo" width={80} height={80} />
          <h1 className="text-4xl font-bold ml-3 text-white">Matchathon</h1>
        </div> */}

        {/* 🔹 Fancy Logo & Title - Positioned with Animated Effects */}
        <div className="fixed top-10 left-10 flex items-center space-x-3 animate-bounce">
          {/* Logo with Glow Effect */}
          <Image
            src="/matcha_logo.png"
            alt="Matchathon Logo"
            width={80}
            height={80}
            className="drop-shadow-lg rounded-full border-4 border-[#f7f2e9]"
          />

          {/* Matchathon Title with Fancy Font & Shadow */}
          <h1 className="text-5xl font-bold text-white font-['Pacifico'] drop-shadow-lg">
            Matchathon
          </h1>
        </div>


        {/* Left Section: Welcome Text */}
        <div className="text-white max-w-lg mt-20"> {/* Added margin-top to push down */}
          {/* Title */}
          <h2 className="text-5xl font-bold font-['Jua'] mb-4">
             Let Innovation Steep Together!
          </h2>

          {/* Description */}
          <p className="text-lg mb-2">
            Find your perfect hackathon team, match with like-minded creators, and brew groundbreaking ideas.
          </p>
          <br />
          <p className="text-lg font-semibold mb-6">Turn your vision into reality! Start Brewing! ☕</p>

          {/* Buttons */}
          <div className="mt-6 flex space-x-4">
            <Link href="/login">
              <button className="bg-[#4F7942] text-white px-8 py-3 text-lg rounded-lg shadow-md hover:bg-[#3d5f32] transition">
                Log In
              </button>
            </Link>
            <Link href="/signup">
              <button className="bg-[#4F7942] text-white px-8 py-3 text-lg rounded-lg shadow-md hover:bg-[#3d5f32] transition">
                Sign Up
              </button>
            </Link>
          </div>
        </div>

        {/* Right Section: Larger Lottie Animation */}
        <div className="w-[40%] flex items-center justify-center rounded-lg ">
          {animationData ? (
            <Lottie animationData={animationData} loop={true} className="w-[600px] h-[500px]" />
          ) : (
            <p className="text-black font-semibold">Loading animation...</p>
          )}
        </div>
      </div>
    </div>
  );
}
