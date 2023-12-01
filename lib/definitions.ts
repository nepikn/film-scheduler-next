import Film from "./film";
import Check from "./check";
import View from "./view";

type FlagExcludedType<Base, Type> = {
  [Key in keyof Base]: Base[Key] extends Type ? never : Key;
};
type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base];
type ConstructorType<T> = Pick<T, AllowedNames<T, Function>>;

export interface AsideAction {
  type: "clearNameCheck";
}

export type FilmPropKey = "name" | "date" | "start" | "end" | "join";
export type FilmConfig =
  | { propChange: "join"; checked: boolean }
  | {
      propChange: Exclude<FilmPropKey, "join">;
      nextValue: string;
    };
export interface SoldoutFilm {
  name: string;
  start: string;
  venue: string;
}

export type CheckConstructor = ConstructorType<Check>;
export interface CheckConfig {
  type: "name" | "date";
  filmNameOrMonthDate: string | number;
  checked: boolean;
}

export type ViewConstructor = ConstructorType<View>;
export interface ViewJoiningIds {
  [k: Film["name"]]: Film["id"] | undefined;
}
export interface ViewInfo {
  groupId: number;
  index: number;
}

export interface ViewState {
  check: Check;
  viewId: string;
  userViews: View[];
}
export interface LocalConfig {
  checkConstructor: CheckConstructor;
  userViewConstructors: ViewConstructor[];
}
