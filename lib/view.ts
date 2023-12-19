import { v4, v5 } from "uuid";
import Film from "./film";
import { ViewConfig } from "./definitions";

interface JoinIds {
  [k: Film["name"]]: Film["id"] | undefined;
}

interface Prop {
  joinIds?: JoinIds;
  config?: ViewConfig;
  groupId?: string;
  randomOrId?: boolean | string;
}

export default class View {
  static findIndex(views: View[], viewId: View["id"]) {
    return views.findIndex((view) => view.id == viewId);
  }
  static find(views: View[], viewId: View["id"]) {
    return views[this.findIndex(views, viewId)];
  }

  static userViewGroupId = "0";
  get belongUserGroup() {
    return this.groupId == View.userViewGroupId;
  }

  static removed = new Set();
  static remove(view: View) {
    this.removed.add(view.id);
  }
  get removed() {
    return View.removed.has(this.id);
  }

  joinIds;
  groupId;
  id;

  constructor({
    joinIds = {},
    groupId = View.userViewGroupId,
    randomOrId = true,
  }: Prop = {}) {
    this.joinIds = { ...joinIds };
    this.groupId = groupId;
    this.id =
      typeof randomOrId == "string"
        ? randomOrId
        : randomOrId
        ? v4()
        : v5(
            Object.values(this.joinIds).join(""),
            "72d85d0e-f574-41d3-abee-1028cf9dd3c1",
          );
  }

  getConfigured(config: ViewConfig) {
    const view = new View({ joinIds: this.joinIds });

    view.handleChange(config);

    return view;
  }

  handleChange({ film, filmConfig }: ViewConfig) {
    const { propChange } = filmConfig;

    if (propChange == "join") {
      if (filmConfig.checked) {
        this.joinIds[film.name] = film.id;
      } else {
        delete this.joinIds[film.name];
      }
      return;
    }

    const { nextValue } = filmConfig;
    if (
      propChange == "name" &&
      nextValue != film.name &&
      this.getJoinStatus(film)
    ) {
      delete this.joinIds[film.name];
    }

    // after film name comparison
    film[propChange] = nextValue;
  }

  getSkipStatus(film: Film): boolean {
    return !!this.getJoiningIdByFilm(film) && !this.getJoinStatus(film);
  }
  getJoinStatus(film: Film) {
    return film.id == this.getJoiningIdByFilm(film);
  }
  getJoiningIdByFilm(film: Film) {
    return this.joinIds[film.name];
  }
}
