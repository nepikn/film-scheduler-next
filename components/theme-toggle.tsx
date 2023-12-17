"use client";

import React from "react";
import { Icons } from "@/components/icons";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="shado w- flex items-center justify-between rounded-full border bg-[#fafafa] p-2 px-4 dark:border-zinc-800 dark:bg-[#111]">
      <button
        className={`mr-2 p-1 text-zinc-700 dark:text-zinc-500 ${
          theme === "system"
            ? "rounded-full bg-white text-zinc-50 shadow-xl dark:bg-[#333]"
            : ""
        }`}
        onClick={() => setTheme("system")}
      >
        <Icons.monitor />
      </button>
      <button
        className={`mr-2 p-1 text-zinc-700 dark:text-zinc-500 ${
          theme === "dark"
            ? "rounded-full bg-white text-zinc-50 shadow-xl dark:bg-[#333]"
            : ""
        }`}
        onClick={() => setTheme("dark")}
      >
        <Icons.moon />
      </button>
      <button
        className={`mr-2 p-1 text-zinc-700 dark:text-zinc-500 ${
          theme === "light"
            ? "rounded-full bg-white text-zinc-700 shadow-xl dark:bg-[#333]"
            : ""
        }`}
        onClick={() => setTheme("light")}
      >
        <Icons.sun />
      </button>
    </div>
  );
}
