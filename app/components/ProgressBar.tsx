"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ProgressBar
        height="3px"
        color="#22c55e" // Tailwind green-500
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
}
