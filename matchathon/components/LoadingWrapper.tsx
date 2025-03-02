"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";

export default function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // Show loading for 2 seconds

    return () => clearTimeout(timeout);
  }, []);

  return isLoading ? <LoadingScreen /> : children;
}
