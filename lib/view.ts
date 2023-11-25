import { v4, v5 } from "uuid";
import Film from "./film";
import { FilmConfig } from "./definitions";
import { ViewJoinFilmIds } from "./definitions";
import ViewGroup from "./viewGroup";

interface ViewConfig {
  film: Film;
  filmConfig: FilmConfig;
}

export default class View {
  static userViewGroupId = "0";
  static removed = new Set();
  // group;
  // index;
  joinIds;
  groupId;
  id;
  get isRemoved() {
    return View.removed.has(this.id);
  }

  remove() {
    View.removed.add(this.id);
  }

  constructor(
    joinIds?: ViewJoinFilmIds,
    config?: ViewConfig,
    groupId = View.userViewGroupId,
    randomId = true,
  ) {
    this.joinIds = { ...joinIds };
    this.groupId = groupId;
    this.id = randomId
      ? v4()
      : v5(
          Object.values(this.joinIds).join(""),
          "72d85d0e-f574-41d3-abee-1028cf9dd3c1",
        );
    if (config) {
      this.handleChange(config);
    }
  }

  handleChange({ film, filmConfig }: ViewConfig) {
    const { propChange } = filmConfig;

    if (propChange == "join") {
      if (filmConfig.isCheck) {
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

    // update value after film name comparison
    film[propChange] = nextValue;
  }

  getSkipStatus(film: Film): boolean {
    const joinFilmId = this.joinIds[film.name];
    return !!joinFilmId && film.id != joinFilmId;
  }

  getJoinStatus(film: Film) {
    return film.id == this.joinIds[film.name];
  }
}
