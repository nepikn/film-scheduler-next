"use client";

import Filter from "@/lib/filter";
import { FiterProp } from "./definitions";
import View from "@/lib/view";
import { ViewProp } from "./definitions";
import { useState } from "react";

type Config = typeof initialState;
const initialState = {
  filter: new Filter(getLocalConfig()?.filter),
  userViews: getLocalConfig().userViews?.map((view) => new View(view.join)) ?? [
    new View(),
  ],
};

export default function useLocalStorage<T>(key: keyof Config) {
  const [state, setState] = useState(initialState[key]);

  return [
    state,
    (val: T) => {
      setLocalConfig(key, val);
      setState(val);
    },
  ] as [T, (k: T) => void];
}

function getLocalConfig(): {
  filter?: FiterProp;
  userViews?: ViewProp[];
} {
  return JSON.parse(localStorage.getItem("scheduler") || "{}");
}

function setLocalConfig(key: keyof Config, val: Config[typeof key]) {
  localStorage.setItem(
    "scheduler",
    JSON.stringify({ ...getLocalConfig(), [key]: val }),
  );
}
