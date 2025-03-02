'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();
  
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
  
      try {
        const response = await fetch("http://localhost:5001/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Login failed");
  
        router.push("/profile");
      } catch (err: any) {
        setError(err.message);
      }
    };
  
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#7DA67D]">
        <div className="w-[500px] p-6 shadow-lg rounded-2xl bg-[#7DA67D] border-none text-center">
          <h2 className="text-white text-[64px] font-normal font-['Jua']">Welcome back!</h2>
          <p className="text-white mb-6">Your perfect blend of teammates awaits.</p>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="text-left">
              <label className="text-white font-semibold">Email</label>
              <input
                type="email"
                className="w-full p-3 rounded-lg bg-[#AFC9AF] border-none text-gray-900"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="text-left">
              <label className="text-white font-semibold">Password</label>
              <input
                type="password"
                className="w-full p-3 rounded-lg bg-[#AFC9AF] border-none text-gray-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="w-full bg-[#5D7B5D] text-white py-3 rounded-lg shadow-md">
              Log In
            </button>
          </form>
          <p className="mt-4 text-white">
            <a href="/signup" className="underline font-semibold">New to Matchathon? Sign Up</a>
          </p>
        </div>
      </div>
    );
  };
  
  export default LoginPage;
  