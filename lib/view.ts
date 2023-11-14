import { v4 } from "uuid";
import Film from "./film";
import { FilmConfig } from "./definitions";
import { ViewJoin } from "./definitions";

interface ViewConfig {
  film: Film;
  filmConfig: FilmConfig;
}

export default class View {
  id;
  join;

  constructor(prevJoin?: ViewJoin, viewConfig?: ViewConfig) {
    this.id = v4();
    this.join = { ...prevJoin };
    if (viewConfig) {
      this.handleChange(viewConfig);
    }
  }

  handleChange({ film, filmConfig }: ViewConfig) {
    const { propChange, nextValue } = filmConfig;

    if (propChange == "join") {
      this.join[film.name] = nextValue ? film.id : null;
      return;
    }

    if (
      propChange == "name" &&
      nextValue != film.name &&
      this.getJoinStatus(film)
    ) {
      this.join[film.name] = null;
    }

    // set next value after film name comparison
    film[propChange] = nextValue;
  }

  getSkipStatus(film: Film): boolean {
    const joinFilmId = this.join[film.name];
    return joinFilmId != null && film.id != joinFilmId;
  }

  getJoinStatus(film: Film) {
    return film.id == this.join[film.name];
  }
}
