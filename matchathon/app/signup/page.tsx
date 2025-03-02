"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";


const skillOptions = [
  "React", "Node.js", "MongoDB", "Express", "Python", "Django", "Flask",
  "PostgreSQL", "MySQL", "Firebase", "AWS", "Docker", "Kubernetes",
  "Figma", "Adobe XD", "Swift", "Kotlin", "JavaScript", "TypeScript"
];


const interestOptions = [
  "Mental Health", "Artificial Intelligence", "Web Development", "Cybersecurity",
  "Startups", "Machine Learning", "Blockchain", "Gaming",
  "Cloud Computing", "UX/UI Design", "Mobile Development",
];


const SignupPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [affiliatedWith, setAffiliatedWith] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();


  const handleSkillChange = (skill: string) => {
    setSkills((prevSkills) =>
      prevSkills.includes(skill)
        ? prevSkills.filter((s) => s !== skill)
        : [...prevSkills, skill]
    );
  };


  const handleInterestChange = (interest: string) => {
    setInterests((prevInterests) =>
      prevInterests.includes(interest)
        ? prevInterests.filter((i) => i !== interest)
        : [...prevInterests, interest]
    );
  };


  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");


    try {
      const response = await fetch("http://localhost:5001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email, password, firstName, lastName, skills, interests,
          aboutMe, location, affiliatedWith, linkedin
        }),
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
          <div className="text-left">
            <label className="text-white font-semibold">Location</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-[#AFC9AF] border-none text-gray-900"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
          </div>
          <div className="text-left">
            <label className="text-white font-semibold">Affiliated With</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-[#AFC9AF] border-none text-gray-900"
              value={affiliatedWith}
              onChange={(e) => setAffiliatedWith(e.target.value)}
              required
            />
          </div>
          <div className="text-left">
            <label className="text-white font-semibold">LinkedIn</label>
            <input
              type="text"
              className="w-full p-3 rounded-lg bg-[#AFC9AF] border-none text-gray-900"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              required
            />
          </div>
          <div className="text-left">
            <label className="text-white font-semibold">About Me</label>
            <textarea
              className="w-full p-3 rounded-lg bg-[#AFC9AF] border-none text-gray-900"
              value={aboutMe}
              onChange={(e) => setAboutMe(e.target.value)}
              required
            />
          </div>
          
          {/* ✅ Skills Selection */}
          <div className="text-left">
            <label className="text-white font-semibold">Skills</label>
            <div className="bg-[#AFC9AF] p-3 rounded-lg text-gray-900 overflow-y-auto h-[150px]">
              {skillOptions.map((skill) => (
                <label key={skill} className="block text-black">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={skills.includes(skill)}
                    onChange={() => handleSkillChange(skill)}
                  />
                  {skill}
                </label>
              ))}
            </div>
          </div>


          {/* ✅ Interests Selection */}
          <div className="text-left">
            <label className="text-white font-semibold">Interests</label>
            <div className="bg-[#AFC9AF] p-3 rounded-lg text-gray-900 overflow-y-auto h-[150px]">
              {interestOptions.map((interest) => (
                <label key={interest} className="block text-black">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={interests.includes(interest)}
                    onChange={() => handleInterestChange(interest)}
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>


          <button type="submit" className="w-full bg-[#5D7B5D] text-white py-3 rounded-lg shadow-md">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};


export default SignupPage;


