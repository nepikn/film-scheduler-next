import localforage from "localforage";
import type { LocalConstructor } from "./definitions";

const key = "localConfig";

export async function getLocalConstructor() {
  const val = await localforage.getItem<LocalConstructor>(key);
  // console.log("get %o", val);
  return val;
}
export async function setLocalConstructor(val: LocalConstructor) {
  await localforage.setItem(key, val);
  // console.log("set %o", val);
}
export function clearLocalConstructor() {
  localforage.removeItem(key);
}
