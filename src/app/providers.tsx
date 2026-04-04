"use client";

import { GymProvider } from "@/context/GymProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <GymProvider>{children}</GymProvider>;
}
