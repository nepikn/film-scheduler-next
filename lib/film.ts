import { getSoldoutByFilm } from "@/public/golden/2023-tp-soldout";
import {
  add,
  areIntervalsOverlapping,
  format,
  getDayOfYear,
  parse,
  setDayOfYear,
  startOfDay,
} from "date-fns";
import { v5 } from "uuid";
import filmData from "../public/golden/2023-tp-id";

type FormatKey = keyof Film["format"];
interface Time extends Interval {
  start: Date;
  end: Date;
  date: Date;
  [Symbol.toPrimitive]: (hint: string) => string | number;
}

export default class Film {
  static _instances: Film[];
  static get instances() {
    return (
      this._instances ??
      (this._instances = filmData.map((row) => new this(...row)))
    );
  }
  static names = new Set(this.instances.map((film) => film.name));
  static interval = {
    start: startOfDay(
      this.instances
        .map((film) => film.time.start)
        .reduce(
          (startTime, earliest) => Math.min(startTime, +earliest),
          Infinity,
        ),
    ),
    end: startOfDay(
      this.instances
        .map((film) => film.time.end)
        .reduce((endTime, latest) => Math.max(endTime, +latest), -Infinity),
    ),
  } satisfies Interval;

  static getSoldoutStatus(name: string) {
    return this.instances
      .filter((film) => film.name == name)
      .every((film) => film.soldout);
  }

  id;
  name;
  venue;
  soldout;

  date!: string;
  start!: string;
  end!: string;
  duration;
  format = {
    date: "yyyy-MM-dd",
    start: "HH:mm",
    end: "HH:mm",
  };
  time: Time;

  isOverlapping(...films: (Film | undefined)[]) {
    return films.some(
      (film) => film && areIntervalsOverlapping(film.time, this.time),
    );
  }

  constructor(
    name = "",
    start = "",
    duration = 0,
    venue = "",
    id = v5(
      [name, start, duration, venue].join("-"),
      "ec7937a4-718c-4e0a-af6e-d47ab3ed26b1",
    ),
  ) {
    const timeStart = start ? new Date(start) : new Date();

    this.id = id;
    this.name = name;
    this.duration = duration;
    this.venue = venue;

    this.time = {
      start: timeStart,
      end: add(timeStart, { minutes: duration }),
      get date() {
        return startOfDay(this.start);
      },
      set date(date) {
        this.start = setDayOfYear(this.start, getDayOfYear(date));
      },

      [Symbol.toPrimitive]: () => `${this.start}-${this.end}`,
    };

    for (const key of Object.keys(this.format) as FormatKey[]) {
      const time = this.time[key];
      const timeFormat = this.format[key];

      Object.defineProperty(this, key, {
        get: () => format(time, timeFormat),
        set: (val) => {
          this.time[key] = parse(val, timeFormat, new Date(time));
          console.log([this.time[key]]);
        },
      });
    }

    // after film.time.start initialize
    this.soldout = getSoldoutByFilm(this);
  }

  // get date() {
  //   return format(this.time["date"], this.format["date"]);
  // }
  // set date(val) {
  //   if (!val) return;

  //   this.time["date"] = parse(val, this.format["date"], new Date());
  // }

  // get start() {
  //   return format(this.time["start"], this.format["start"]);
  // }
  // set start(val) {
  //   if (!val) return;

  //   this.time["start"] = parse(val, this.format["start"], this.time["start"]);
  //   console.log(this.time.start);
  // }

  // get end() {
  //   return format(this.interval.end, "HH:mm");
  // }
  // set end(val) {
  //   const [hour, minute] = val.split(":");
  //   this.interval.end.setHours(+hour);
  //   this.interval.end.setMinutes(+minute);
  // }
}
