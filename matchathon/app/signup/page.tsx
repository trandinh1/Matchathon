'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#7DA67D]">
      <div className="w-[500px] p-6 shadow-lg rounded-2xl bg-[#7DA67D] border-none text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Sign Up</h2>
        <p className="text-white mb-6">Join us and start your journey.</p>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="text-left">
            <label className="text-white font-semibold">First Name</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-[#AFC9AF] border-none text-gray-900"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="text-left">
            <label className="text-white font-semibold">Last Name</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-[#AFC9AF] border-none text-gray-900"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
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
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-white">
          <a href="/login" className="underline font-semibold">Already have an account? Log In</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
