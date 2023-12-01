import Film from "./film";
import View from "./view";
import { CheckConfig, CheckConstructor } from "./definitions";

export default class Check {
  name: {
    [k: Film["name"]]: boolean | undefined;
  };
  date: {
    [k: Film["date"]]: boolean;
  };

  constructor(prevCheck?: CheckConstructor | null, config?: CheckConfig) {
    if (prevCheck) {
      this.name = { ...prevCheck.name };
      this.date = { ...prevCheck.date };
      if (config) {
        this[config.type][config.filmNameOrMonthDate] = config.checked;
      }
    } else {
      this.name = { 燃冬: true, 霧中潛行: true };
      this.date = Object.fromEntries(
        [...new Array(31)].map((_, i) => [i + 1, true]),
        // todo: init date filter according to initial film data
        // adjust <DateFilter /> argument
      );
    }
  }

  getFilteredFilms() {
    return Film.instances.filter(
      (film) => this.name[film.name] && this.date[film.time.date.getDate()],
    );
  }

  getShownValidViews(loopLimit = 5000) {
    const filteredFilms = this.getFilteredFilms();
    if (!filteredFilms.length) return [];

    const groupByName: { [k: Film["name"]]: Film[] } = {};
    filteredFilms.forEach((film) => {
      if (film.name in groupByName) {
        groupByName[film.name].push(film);
      } else {
        groupByName[film.name] = [film];
      }
    });

    const groups = Object.values(groupByName);
    const result = [];
    const indexes: number[] = new Array(groups.length).fill(0);
    let loop = 1;
    let i = 0;
    while (true) {
      const curFilm = groups[i][indexes[i]];
      const overlapping = indexes
        .slice(0, i)
        .map((index, j) => groups[j][index])
        .some((film) => curFilm.isOverlapping(film));

      if (!overlapping) {
        loop++;

        if (i < groups.length - 1) {
          i++;
          continue;
        }

        const view = new View(
          Object.fromEntries(
            indexes.map((i, j) => [groups[j][i].name, groups[j][i].id]),
          ),
          undefined,
          "1",
          false,
        );

        if (!view.removed) {
          result.push(view);
        }
      }

      while (indexes[i] >= groups[i].length - 1) {
        if (i == 0 || loop++ >= loopLimit) {
          return result;
        }

        indexes[i--] = 0;
      }

      indexes[i]++;
    }
  }
}
