import Film from "./film";
import View from "./view";
import { StatusConfig, FilterStatusConstructor } from "./definitions";
import { eachDayOfInterval, endOfMonth, startOfMonth } from "date-fns";

export default class FilterStatus {
  name = { 燃冬: true, 霧中潛行: true } as {
    [filmName: Film["name"]]: boolean | undefined;
  };
  date = Object.fromEntries(
    eachDayOfInterval({
      start: startOfMonth(Film.interval.start),
      end: endOfMonth(Film.interval.end),
    }).map((date) => [+date, true]),
    // todo: init date filter according to initial film data
    // adjust <DateFilter /> argument
  );

  constructor(prevStatus?: FilterStatusConstructor, config?: StatusConfig) {
    if (!prevStatus) return;

    this.name = prevStatus.name ? { ...prevStatus.name } : this.name;
    this.date = prevStatus.date ? { ...prevStatus.date } : this.date;

    if (!config) return;

    if ("status" in config) {
      this[config.type] = config.status;
    } else {
      this[config.type][config.filmNameOrMonthDate] = config.checked;
    }
  }

  getFilteredFilms() {
    return Film.instances.filter(
      (film) => this.name[film.name] && this.date[+film.time.date],
    );
  }

  getSuggestViews(/* removedIds: Set<View["id"]> , */ loopLimit = 5000) {
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

      if (!curFilm.soldout && !overlapping) {
        loop++;

        if (i < groups.length - 1) {
          i++;
          continue;
        }

        const view = new View({
          joinIds: Object.fromEntries(
            indexes.map((i, j) => [groups[j][i].name, groups[j][i].id]),
          ),
          groupId: "1",
          randomOrId: false,
        });

        // if (!removedIds.has(view.id) /* !view.removed */) {
        result.push(view);
        // }
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
