import Film from "./film";
import View from "./view";
import Check from "./check";

export interface Action {
  type: "clear";
}

export type FilmPropKey = "name" | "date" | "start" | "end" | "join";
export type FilmConfig =
  | { propChange: "join"; nextValue: boolean }
  | {
      propChange: Exclude<FilmPropKey, "join">;
      nextValue: string;
    };
export interface SoldoutFilm {
  name: string;
  start: string;
  venue: string;
}

export type CheckProp = ConstructorType<Check>;
export interface CheckConfig {
  type: "name" | "date";
  key: string | number;
  isCheck: boolean;
}

export type ViewProp = ConstructorType<View>;
export interface ViewJoin {
  [k: Film["name"]]: Film["id"] | null;
}
type FlagExcludedType<Base, Type> = {
  [Key in keyof Base]: Base[Key] extends Type ? never : Key;
};
type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base];
type ConstructorType<T> = Pick<T, AllowedNames<T, Function>>;
