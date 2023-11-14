import Film from "./film";
import View from "./view";
import useLocalStorage from "./useLocalStorage";

export type SoldoutFilm = {
  name: string;
  start: string;
  venue: string;
};
// interface FilmName {
//   [Id: Film["id"]]: Film["name"] | null;
// }

export interface Join {
  [Name: Film["name"]]: Film["id"] | null;
}
export interface ViewGroup {
  id: string;
  name: string;
  title: string;
  views: View[];
  setViews: ReturnType<typeof useLocalStorage<View[]>>[1];
}
export interface FilterConfig {
  type: "name" | "date";
  key: string | number;
  isCheck: boolean;
}
