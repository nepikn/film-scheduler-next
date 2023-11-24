"use client";

import Check from "@/lib/check";
import { CheckProp } from "./definitions";
import View from "@/lib/view";
import { ViewProp } from "./definitions";
import { useState } from "react";

type Config = typeof initialState;
const initialState = {
  check: new Check(getLocalConfig()?.check),
  userViews: getLocalConfig().userViews?.map(
    (view) => new View(view.joinIds),
  ) ?? [new View()],
};

export default function useLocalStorage<T extends Check | View[]>(
  key: keyof Config,
) {
  const [state, setState] = useState(initialState[key]);

  return [
    state,
    (val: T) => {
      setLocalConfig(key, val);
      setState(val);
    },
  ] as [T, (k: T) => void];
}

export function getLocalConfig(): {
  check?: CheckProp;
  userViews?: ViewProp[];
} {
  return JSON.parse(localStorage.getItem("scheduler") || "{}");
}

export function setLocalConfig(key: keyof Config, val: any) {
  localStorage.setItem(
    "scheduler",
    JSON.stringify({ ...getLocalConfig(), [key]: val }),
  );
}
