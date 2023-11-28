// "use client";

// import Check from "@/lib/check";
// import { CheckConstructor } from "./definitions";
// import View from "@/lib/view";
// import { ViewConstructor } from "./definitions";
// import { useState } from "react";

// type Config = typeof initialState;
// const initialState = {
//   check: new Check(getLocalConfig()?.checkConstructor),
//   userViews: getLocalConfig().userViewConstructors?.map(
//     (construtor) => new View(construtor.joinIds),
//   ) ?? [new View()],
// };

// export default function useLocalStorage<T extends Check | View[]>(
//   key: keyof Config,
// ) {
//   const [state, setState] = useState(initialState[key]);

//   return [
//     state,
//     (val: T) => {
//       setLocalConfig(key, val);
//       setState(val);
//     },
//   ] as [T, (k: T) => void];
// }

// export function getLocalConfig(): {
//   checkConstructor?: CheckConstructor;
//   userViewConstructors?: ViewConstructor[];
// } {
//   return JSON.parse(localStorage.getItem("scheduler") || "{}");
// }

// export function setLocalConfig(key: keyof Config, val: any) {
//   localStorage.setItem(
//     "scheduler",
//     JSON.stringify({ ...getLocalConfig(), [key]: val }),
//   );
// }
