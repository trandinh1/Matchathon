"use client";

import loadingAnimation from "@/public/loading.json"; // Ensure it's in `/public`
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const LoadingScreen = () => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#7DA67D] z-50"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }} // Faster fade-out
      >
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          //className="w-[70vw] h-[70vh]" 
          className="w-[900px] h-[900px]" // ⏩ Make it BIGGER
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default LoadingScreen;
