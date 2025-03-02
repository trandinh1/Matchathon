'use client';

import { useRouter } from "next/navigation";
import Link from 'next/link';

export const Navbar = () => {
    return (
        <nav className="w-[216px] h-[832px] p-4 bg-[#effae9] rounded-bl-[13px] rounded-br-[13px] shadow-[0px_8px_11px_-4px_rgba(45,54,67,0.04)] shadow-[0px_20px_24px_-4px_rgba(45,54,67,0.04)] flex-col justify-center items-center gap-3 inline-flex overflow-hidden">
            <div className="">
                <a href="/profile" className="text-2xl font-bold">Profile</a>
                <div className="w-[184px] h-64 flex-col justify-center items-start gap-1 flex">
                    <div className="w-[184px] h-12 p-3 rounded-[10px] justify-between items-center inline-flex bg-white">
                        <Link href="/profile"  className="text-2xl font-bold hover:text-gray-300">Profile</Link>
                    </div>
                    <div className="w-[184px] h-12 p-3 rounded-[10px] justify-between items-center inline-flex bg-white">
                       <Link href="/team" className="text-2xl font-bold hover:text-gray-300">Team</Link> 
                    </div>
                    <div className="w-[184px] h-12 p-3 rounded-[10px] justify-between items-center inline-flex bg-white">
                      <Link href="/hackathons" className="text-2xl font-bold hover:text-gray-300">Hackathons</Link>  
                    </div>
                    <div className="w-[184px] h-12 p-3 rounded-[10px] justify-between items-center inline-flex bg-white">
                       <Link href="/match" className="text-2xl font-bold hover:text-gray-300">MatchGround</Link> 
                    </div>
                    <div className="w-[184px] h-12 p-3 rounded-[10px] justify-between items-center inline-flex bg-white">
                       <Link href="/messages" className="text-2xl font-bold hover:text-gray-300">Messages</Link>  
                    </div>
                </div>
            </div>
            
        </nav>
    )
};