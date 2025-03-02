"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, MessageCircle, Coffee, Users, Calendar, LogOut } from "lucide-react";

export const Navbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // Get user email from URL

  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string; avatar?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return; // Prevent fetch if no email is present

    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:5001/api/profile/${email}`);
        if (!response.ok) throw new Error("User not found");
        const data = await response.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [email]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("userToken"); // If using local storage for authentication
    sessionStorage.removeItem("userEmail"); // Remove stored email
    router.push("/login"); // Redirect to login page
  };

  return (
    <nav className="w-[250px] min-w-[250px] max-w-[250px] h-screen p-4 bg-[#d3e8c8] flex flex-col justify-between rounded-bl-[13px] shadow-lg">
      
      {/* 🔹 Profile Section (Show User Info) */}
      <div className="flex flex-col items-center text-center mb-4">
        {/* Show avatar if available, otherwise default image */}
        <Image
          src={user?.avatar || "/default-avatar.png"}
          alt="User Avatar"
          width={60}
          height={60}
          className="rounded-full border-2 border-white"
        />
        {/* Show Loading/Error State */}
        {loading ? (
          <p className="mt-2 text-sm font-semibold text-gray-500">Loading...</p>
        ) : error ? (
          <p className="mt-2 text-sm text-red-500">Error: {error}</p>
        ) : user ? (
          <>
            <p className="mt-2 text-sm font-semibold text-black">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-gray-700">{user.email}</p>
          </>
        ) : (
          <p className="text-sm text-gray-500">No user data</p>
        )}
      </div>

      {/* 🔹 Navigation Menu */}
      <div className="flex flex-col space-y-2">
        <NavItem href={`/profile?email=${email}`} label="Profile" icon={<User size={20} />} />
        <NavItem href={`/message?email=${email}`} label="Tea Chat" icon={<MessageCircle size={20} />} badge={21} />
        <NavItem href={`/brew-crew?email=${email}`} label="Brew Crew" icon={<Coffee size={20} />} />
        <NavItem href={`/matchground?email=${email}`} label="Matchground" icon={<Users size={20} />} />
        <NavItem href={`/hackathon?email=${email}`} label="Hackathon" icon={<Calendar size={20} />} />
      </div>

      {/* 🔹 Logout Button */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center justify-start gap-3 bg-[#f1f9ef] w-full p-3 rounded-md shadow-sm hover:bg-gray-200"
        >
          <LogoutIcon />
          <span className="text-black text-sm font-normal">Logout</span>
        </button>
      </div>
    </nav>
  );
};

/* 🔹 Reusable Navigation Item Component */
type NavItemProps = {
  href: string;
  label: string;
  icon: JSX.Element;
  badge?: number;
};

const NavItem: React.FC<NavItemProps> = ({ href, label, icon, badge }) => {
  return (
    <Link
      href={href}
      className="flex items-center justify-between bg-[#f1f9ef] p-3 rounded-md shadow-sm hover:bg-gray-200"
    >
      <span className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-semibold text-black">{label}</span>
      </span>
      {badge && (
        <span className="bg-[#7bb17e] text-white text-xs font-bold px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
};

/* 🔹 Logout Icon */
const LogoutIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.9498 19.5201C11.0931 19.6553 11.2828 19.7304 11.4798 19.7301C11.6761 19.7318 11.8643 19.6521 11.9998 19.5101C12.1428 19.3708 12.2234 19.1797 12.2234 18.9801C12.2234 18.7805 12.1428 18.5894 11.9998 18.4501L6.29975 12.75H19.52C19.9342 12.75 20.27 12.4142 20.27 12C20.27 11.5858 19.9342 11.25 19.52 11.25H6.29756L12.0098 5.52006C12.1528 5.38077 12.2334 5.18965 12.2334 4.99006C12.2334 4.79048 12.1528 4.59935 12.0098 4.46006C11.717 4.16761 11.2426 4.16761 10.9498 4.46006L3.94981 11.4601C3.65736 11.7529 3.65736 12.2272 3.94981 12.5201L10.9498 19.5201Z" fill="#7BB27E"/>
  </svg>
);

export default Navbar;
