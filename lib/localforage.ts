import localforage from "localforage";
import type { LocalState, ViewState } from "./definitions";
import { useEffect } from "react";

export function useLocalEffect(
  state: ViewState,
  localizer: (x: LocalState) => void,
) {
  useEffect(() => {
    getLocalConstructor().then((localState) => {
      if (localState) {
        localizer(localState);
      }
    });
  }, [localizer]);

  useEffect(() => {
    setLocalConstructor(state);
  }, [state]);
}

const key = "localConfig";
async function getLocalConstructor() {
  const val = await localforage.getItem<LocalState>(key);
  // console.log("get %o", val);
  return val;
}
async function setLocalConstructor(state: ViewState) {
  await localforage.setItem(key, state);
  // console.log("set %o", val);
}
export function clearLocalConstructor() {
  localforage.removeItem(key);
}
