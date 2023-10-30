import { areIntervalsOverlapping } from "date-fns";
import Film from "./Film";
import View from "./View";
import { FilterCheckbox } from "../components/Input";

interface FiterProp {
  name?: {
    [filmName: string]: boolean;
  };
  date?: {
    [filmDate: string]: boolean;
  };
}

export default class Filter {
  name: {
    [filmName: string]: boolean;
  };
  date: {
    [filmDate: string]: boolean;
  };

  constructor(filter?: FiterProp, input?: FilterCheckbox) {
    if (filter) {
      this.name = { ...filter.name };
      this.date = { ...filter.date };
      if (input) {
        this[input.name][input.value] = input.checked;
      }
    } else {
      this.name = { 燃冬: true, 霧中潛行: true };
      this.date = Object.fromEntries(
        [...new Array(31)].map((_, i) => [i + 1, true])
      );
    }
  }

  get validFilms() {
    return Film.instances.filter(
      (film) => this.name[film.name] && this.date[film.time.date.getDate()]
    );
  }

  get validViews() {
    const group: { [indexed: string]: Film[] } = {};
    const validFilms = this.validFilms;
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
              indexes.map((i, j) => [groups[j][i].name, groups[j][i].id])
            )
          )
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
