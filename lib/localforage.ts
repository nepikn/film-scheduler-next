import localforage from "localforage";
import type { LocalConstructor } from "./definitions";

const key = "localConfig";

export function getLocalConstructor() {
  return localforage.getItem<LocalConstructor>(key);
}
export function setLocalConstructor(val: LocalConstructor) {
  return localforage.setItem(key, val);
}
