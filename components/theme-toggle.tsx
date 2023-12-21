"use client";

import React from "react";
import { Icons } from "@/components/icons";
import { useTheme } from "next-themes";
import clsx from "clsx";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const buttons = [
    { theme: "system", icon: "monitor" },
    { theme: "dark", icon: "moon" },
    { theme: "light", icon: "sun" },
  ] as { theme: string; icon: keyof typeof Icons }[];

  return (
    <fieldset className="flex justify-items-center gap-1 rounded-full bg-stone-200 px-2 py-1 dark:bg-neutral-600">
      {buttons.map((button) => {
        const Icon = Icons[button.icon];

        return (
          <button
            key={button.theme}
            className={clsx(
              "px-2 py-1 text-stone-400",
              theme == button.theme &&
                "rounded-full bg-stone-50 text-stone-500 shadow dark:bg-neutral-700 dark:text-neutral-200",
            )}
            onClick={() => setTheme(button.theme)}
          >
            <Icon />
          </button>
        );
      })}
    </fieldset>
  );
}
