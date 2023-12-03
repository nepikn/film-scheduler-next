import Film from "./film";
import CheckStatus from "./check";
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

export type CheckStatusConstructor = ConstructorType<CheckStatus>;
export type CheckConfig =
  | {
      type: "name" | "date";
      filmNameOrMonthDate: string | number;
      checked: boolean;
    }
  | {
      type: "name" | "date";
      status: CheckStatusConstructor["name"];
    };

export type ViewConstructor = ConstructorType<View>;
export interface ViewJoiningIds {
  [k: Film["name"]]: Film["id"] | undefined;
}
export interface ViewInfo {
  groupId: number;
  index: number;
}

export interface ViewState {
  check: CheckStatus;
  viewId: string;
  userViews: View[];
}
export interface LocalConstructor {
  checkStatusGroup: { [id: View["id"]]: CheckStatusConstructor };
  userViews: ViewConstructor[];
}
