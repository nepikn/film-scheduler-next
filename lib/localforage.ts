import localforage from "localforage";
import type { LocalState, ViewState } from "./definitions";
import { useEffect } from "react";

const storeKey = "localConfig";
export function useLocalView(
  state: ViewState,
  handleLocalize: (x: LocalState) => void,
) {
  useEffect(() => {
    // localforage.clear();
    localforageGet<LocalState>(storeKey).then((localState) => {
      if (localState) {
        handleLocalize(localState);
      }
    });
  }, [handleLocalize]);

  useEffect(() => {
    localforageSet(storeKey, state);
  }, [state]);
}

const store = localforage.createInstance({ name: location.pathname });
export async function localforageGet<T>(key: string) {
  const val = await store.getItem<T>(key);
  // console.log("get %o", val);
  return val;
}
export async function localforageSet(key: string, val: any) {
  await store.setItem(key, val);
  // console.log("set %o", state);
}
export function localforageRemove(key: string) {
  store.removeItem(key);
}
export const clearLocalConstructor = localforageRemove.bind(null, storeKey);
