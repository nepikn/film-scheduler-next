import { v4, v5 } from "uuid";
import Film from "./film";
import { FilmConfig, ViewJoiningIds } from "./definitions";

interface ViewConfig {
  film: Film;
  filmConfig: FilmConfig;
}

export default class View {
  static userViewGroupId = "0";
  get belongUserViewGroup() {
    return this.groupId == View.userViewGroupId;
  }

  static removed = new Set();
  static remove(view: View) {
    this.removed.add(view.id);
  }
  get removed() {
    return View.removed.has(this.id);
  }

  joiningIds;
  groupId;
  id;

  constructor(
    joinIds?: ViewJoiningIds,
    config?: ViewConfig,
    groupId = View.userViewGroupId,
    randomOrId: boolean | string = true,
  ) {
    this.joiningIds = { ...joinIds };
    this.groupId = groupId;
    this.id =
      typeof randomOrId == "string"
        ? randomOrId
        : randomOrId
        ? v4()
        : v5(
            Object.values(this.joiningIds).join(""),
            "72d85d0e-f574-41d3-abee-1028cf9dd3c1",
          );
    if (config) {
      this.handleChange(config);
    }
  }

  generateUserView(config: ViewConfig) {
    return new View(this.joiningIds, config);
  }

  handleChange({ film, filmConfig }: ViewConfig) {
    const { propChange } = filmConfig;

    if (propChange == "join") {
      if (filmConfig.checked) {
        this.joiningIds[film.name] = film.id;
      } else {
        delete this.joiningIds[film.name];
      }
      return;
    }

    const { nextValue } = filmConfig;
    if (
      propChange == "name" &&
      nextValue != film.name &&
      this.getJoinStatus(film)
    ) {
      delete this.joiningIds[film.name];
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
    return this.joiningIds[film.name];
  }
}
