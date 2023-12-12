import Film from "./film";
import FilterStatus from "./filterStatus";
import View from "./view";

type FlagExcludedType<Base, Type> = {
  [Key in keyof Base]: Base[Key] extends Type ? never : Key;
};
type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base];
type ConstructorType<T> = Pick<T, AllowedNames<T, Function>>;

export interface AsideAction {
  type: "clearNameFilter";
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

export type FilterStatusConstructor = Partial<ConstructorType<FilterStatus>>;
export type CheckConfig =
  | {
      type: "name" | "date";
      filmNameOrMonthDate: string | number;
      checked: boolean;
    }
  | {
      type: "name";
      status: ConstructorType<FilterStatus>["name"];
    };

export interface ViewConfig {
  film: Film;
  filmConfig: FilmConfig;
}

export type ViewConstructor = ConstructorType<View>;
export interface ViewState {
  check: FilterStatus;
  viewId: string;
  userViews: View[];
}
export interface LocalConstructor {
  filterStatusGroup: { [id: View["id"]]: FilterStatusConstructor };
  userViews: ViewConstructor[];
}
