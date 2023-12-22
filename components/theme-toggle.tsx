"use client";

import React, { useEffect } from "react";
import { Icons } from "@/components/icons";
import { useTheme } from "next-themes";
import clsx from "clsx";
import {
  localforageGet,
  localforageRemove,
  localforageSet,
} from "@/lib/localforage";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const buttons = [
    { theme: "system", icon: "monitor" },
    { theme: "dark", icon: "moon" },
    { theme: "light", icon: "sun" },
  ] as { theme: string; icon: keyof typeof Icons }[];
  const storeKey = "theme";

  // useEffect(() => {
  //   localforageGet<string>(storeKey).then((localTheme) => {
  //     if (localTheme != null) {
  //       setTheme(localTheme);
  //     }
  //   });
  //   // localforageRemove(storeKey);
  // }, []);

  return (
    <fieldset className="flex justify-items-center gap-1 rounded-full bg-stone-200 px-2 py-1 dark:bg-neutral-600">
      {buttons.map(({ theme: buttonTheme, icon }) => {
        const Icon = Icons[icon];

        return (
          <button
            key={buttonTheme}
            className={clsx(
              "px-2 py-1 text-stone-400",
              (theme ?? "system") == buttonTheme &&
                "text-secondary rounded-full bg-stone-50 shadow dark:bg-neutral-700 dark:text-neutral-200",
            )}
            onClick={() => {
              setTheme(buttonTheme);
              // localforageSet(storeKey, buttonTheme);
            }}
          >
            <Icon />
          </button>
        );
      })}
    </fieldset>
  );
}
