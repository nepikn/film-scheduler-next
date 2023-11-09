"use client";

import Filter, { FiterProp } from "@/lib/Filter";
import View, { Join } from "@/lib/View";
import { useState } from "react";

export interface Config {
  filter?: FiterProp;
  userViews?: { id: string; join: Join }[];
}

function getLocalConfig() {
  return JSON.parse(localStorage.getItem("scheduler") || "{}") as Config;
}

function setLocalConfig(key: keyof Config, val: Filter | View[]) {
  const nextConfig = { ...getLocalConfig(), [key]: val };
  localStorage.setItem("scheduler", JSON.stringify(nextConfig));
}

export default function useLocalStorage<T extends Filter | View[]>(
  key: keyof Config,
): [T, (val: T) => void] {
  const localConfig = getLocalConfig();
  const initial = {
    filter: new Filter(localConfig?.filter),
    userViews: (localConfig.userViews ?? [{ join: undefined }]).map(
      (view) => new View(view.join),
    ),
  };
  const [state, setState] = useState(initial[key]);

  return [
    state,
    (val: typeof state) => {
      setLocalConfig(key, val);
      setState(val);
    },
  ];
}
