import localforage from "localforage";
import type { LocalConfig } from "./definitions";

export function getLocalConfig() {
  return localforage.getItem<LocalConfig>("localConfig");
}

export function setLocalConfig(val: LocalConfig) {
  return localforage.setItem("localConfig", val);
}
