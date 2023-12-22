import localforage from "localforage";
import type { LocalState, ViewState } from "./definitions";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const storeKey = "localConfig";
export function useLocalView(
  state: ViewState,
  handleLocalize: (x: LocalState) => void,
) {
  const store = localforage.createInstance({ name: usePathname() });

  useEffect(() => {
    // localforage.clear();
    store.getItem<LocalState>(storeKey).then((localState) => {
      // localforageGet<LocalState>(storeKey).then((localState) => {
      if (localState) {
        handleLocalize(localState);
      }
    });
  }, [handleLocalize]);

  useEffect(() => {
    store.setItem(storeKey, state);
    // localforageSet(storeKey, state);
  }, [state]);

  return () => store.removeItem(storeKey);
}

// const store = localforage.createInstance({ name: location.pathname });
// const store = getStore();
// export async function localforageGet<T>(key: string) {
//   const val = await store.getItem<T>(key);
//   // console.log("get %o", val);
//   return val;
// }
// export async function localforageSet(key: string, val: any) {
//   await store.setItem(key, val);
//   // console.log("set %o", state);
// }
// export function localforageRemove(key: string) {
//   store.removeItem(key);
// }
// export const clearLocalConstructor = localforageRemove.bind(null, storeKey);

// function getStore() {
//   "use client";
//   // const pathname = __dirname == "/" ? location.pathname : __dirname;
//   // console.log(pathname);

//   // const pathname = usePathname();
//   return localforage.createInstance({ name: location.pathname });
// }
