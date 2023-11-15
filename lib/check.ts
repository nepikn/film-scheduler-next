import { areIntervalsOverlapping } from "date-fns";
import Film from "./film";
import View from "./view";
import { CheckConfig } from "./definitions";
import { CheckProp } from "./definitions";

export default class Check {
  name: {
    [k: Film["name"]]: boolean | undefined;
  };
  date: {
    [k: Film["date"]]: boolean;
  };

  constructor(prevCheck?: CheckProp, config?: CheckConfig) {
    if (prevCheck) {
      this.name = { ...prevCheck.name };
      this.date = { ...prevCheck.date };
      if (config) {
        this[config.type][config.key] = config.isCheck;
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

  getValidViews() {
    const group: { [indexed: string]: Film[] } = {};
    const validFilms = this.getFilteredFilms();
    if (!validFilms.length) return [];

    validFilms.forEach((film) => {
      if (film.name in group) {
        group[film.name].push(film);
      } else {
        group[film.name] = [film];
      }
    });

    const result = [];
    const groups = Object.values(group);
    const indexes: number[] = new Array(groups.length).fill(0);

    let k = 0;
    for (let i = 0; ; k++) {
      // console.log(indexes);
      const curFilm = groups[i][indexes[i]];
      const isOverlapping = indexes
        .slice(0, i)
        .map((index, j) => groups[j][index])
        .some((film) => areIntervalsOverlapping(curFilm.time, film.time));

      if (!isOverlapping) {
        if (i < groups.length - 1) {
          i++;
          continue;
        }

        result.push(
          new View(
            Object.fromEntries(
              indexes.map((i, j) => [groups[j][i].name, groups[j][i].id]),
            ),
          ),
        );
      }

      if (indexes[i] < groups[i].length - 1) {
        indexes[i]++;
        continue;
      }

      while (indexes[i] >= groups[i].length - 1) {
        if (i == 0 || k++ >= 9999) {
          // console.log(k);
          return result;
        }

        indexes[i--] = 0;
      }
      indexes[i]++;
    }
  }
}
