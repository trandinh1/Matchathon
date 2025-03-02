"use client";

import { useSearchParams } from "next/navigation";
import MatchProfile from "@/components/MatchProfile";
import { Navbar } from "@/components/navbar";

export default function MatchPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email"); // ✅ Extract email from URL

  if (!email) {
    return <p className="text-red-500 text-center">No email provided in the URL</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <MatchProfile userEmail={email} />
    </div>
  );
}





