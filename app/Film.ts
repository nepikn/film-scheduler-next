import filmData from "../public/film/film-golden-tp-id.json";
import {
  add,
  format,
  getDayOfYear,
  parse,
  setDayOfYear,
  startOfDay,
} from "date-fns";
import { v5 } from "uuid";

type FormatKey = keyof Film["format"];

export default class Film {
  name;
  venue;
  id;
  date!: string;
  start!: string;
  end!: string;
  format = {
    date: "yyyy-MM-dd",
    start: "HH:mm",
    end: "HH:mm",
  };
  time: {
    [Key in FormatKey]: Date;
  } & {
    [Symbol.toPrimitive]: (hint: string) => string | number;
  };

  static nameSet: Set<string> = new Set();
  static _instances: Film[];
  static get instances() {
    return this._instances ?? filmData.map((row) => new this(...row));
  }

  constructor(
    name = "",
    start = "",
    interval = 0,
    venue = "",
    id = v5(
      [name, start, interval, venue].join("-"),
      "ec7937a4-718c-4e0a-af6e-d47ab3ed26b1"
    )
  ) {
    const timeStart = start ? new Date(start) : new Date();

    this.name = name;
    this.venue = venue;
    this.id = id;
    this.time = {
      start: timeStart,
      end: add(timeStart, { minutes: interval }),
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

    Film.nameSet.add(this.name);
    // if (!Film.instances.find((film) => film.id == this.id)) {
    //   Film.instances.push(this);
    // }
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
