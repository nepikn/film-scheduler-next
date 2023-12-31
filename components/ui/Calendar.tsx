"use client";

import { useState } from "react";
import {
  eachWeekOfInterval,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  startOfMonth,
} from "date-fns";
import Film from "../../lib/film";
import View from "../../lib/view";
import FilmInput from "./Input";
import { FilmConfig, ViewConfig } from "@/lib/definitions";
import FilterStatus from "../../lib/filterStatus";
import clsx from "clsx";
import { StatusConfig } from "@/lib/definitions";

interface CalendarProp {
  view: View;
  dateFilterStatus: FilterStatus["date"];
  filteredFilms: Film[];
  handleFilterChange: (k: StatusConfig) => void;
  handleJoinChange: (viewConfig: ViewConfig) => void;
}

export default function Calendar({
  view,
  filteredFilms,
  dateFilterStatus,
  handleFilterChange,
  handleJoinChange,
}: CalendarProp) {
  // console.group("cal");
  // console.log(dateFilterStatus);
  const [monthStart, setMonthStart] = useState(
    startOfMonth(Film.interval.start),
  );
  const sortFilms = [...filteredFilms].sort((a, b) =>
    view.getSkipStatus(a) == view.getSkipStatus(b)
      ? +a.time.start - +b.time.start
      : view.getSkipStatus(a)
      ? 1
      : -1,
  );
  const weeks = eachWeekOfInterval({
    start: monthStart,
    end: endOfMonth(monthStart),
  }).map((sun) => (
    <fieldset key={sun.getTime()} className="grid grid-cols-7 divide-x">
      {eachDayOfInterval({ start: sun, end: endOfWeek(sun) }).map((date) => (
        <div
          key={date.getTime()}
          className="space-y-4 border-neutral-300 dark:border-neutral-700 py-3 [&>*]:px-4"
        >
          {date.getMonth() == monthStart.getMonth() && (
            <>
              <DateFilter
                checked={!!dateFilterStatus[+date]}
                date={date}
                handleChange={handleFilterChange}
              />
              <Agenda
                dayFilms={sortFilms.filter((film) =>
                  isSameDay(film.time.start, date),
                )}
                view={view}
                handleJoinChange={handleJoinChange}
              />
            </>
          )}
        </div>
      ))}
    </fieldset>
  ));

  // console.groupEnd();
  return (
    <div className="flex flex-col items-center gap-4">
      {/* <label>
        <input
          type="month"
          defaultValue={format(monthStart, "yyyy-MM")}
          onChange={(e) => setMonthStart(new Date(e.target.value))}
        />
      </label> */}
      <div className="w-full divide-y border">
        <ul className="grid grid-cols-7 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((title) => (
            <li key={title} className="font-medium">
              {title}
            </li>
          ))}
        </ul>
        <fieldset className="grid grid-rows-[repeat(6,max-content)] divide-y">
          {weeks}
        </fieldset>
      </div>
    </div>
  );
}

interface DateFilter {
  checked: boolean;
  date: Date;
  handleChange: CalendarProp["handleFilterChange"];
}

function DateFilter({ checked, date, handleChange }: DateFilter) {
  return (
    <label className="grid cursor-pointer justify-end hover:text-gray-400">
      <input
        type="checkbox"
        name={"date"}
        value={+date}
        checked={checked}
        className="hidden"
        onChange={(e) =>
          handleChange({
            type: "date",
            filmNameOrMonthDate: +date,
            checked: e.target.checked,
          })
        }
      />
      <span
        className={clsx(
          "whitespace-nowrap leading-none",
          checked || "text-gray-400 line-through decoration-4",
        )}
      >
        {date.getDate()}
      </span>
    </label>
  );
}

function Agenda({
  dayFilms: films,
  view,
  handleJoinChange,
}: {
  dayFilms: Film[];
  view: View;
  handleJoinChange: CalendarProp["handleJoinChange"];
}) {
  const filterStatus = films.map((film) => view.getJoinStatus(film));
  return (
    <div className="max-h-48 space-y-2 overflow-auto pb-1 text-right">
      {films.map((film, i) => {
        const pStyle = "leading-none";
        const checked = filterStatus[i];
        const warning =
          checked &&
          [-1, 1].some((offset) => {
            const targFilm = films[i + offset];
            return (
              targFilm &&
              filterStatus[i + offset] &&
              film.isOverlapping(targFilm)
            );
          });

        return (
          <label
            key={film.id}
            className={clsx(
              "grid cursor-pointer grid-cols-[1fr_auto] gap-x-2 gap-y-1 hover:text-gray-500 dark:hover:text-gray-300 [&:has(:disabled)]:cursor-default",
              film.soldout && "line-through decoration-4",
              (film.soldout || view.getSkipStatus(film)) && "text-gray-400",
              warning && "text-orange-700 dark:text-red-300",
            )}
          >
            <p className={clsx(pStyle, "text-xl font-medium")}>{film.name}</p>
            <FilmInput
              prop="join"
              // val={view.getChecked(film)}
              // value={film['join']}
              // view={view}
              checked={checked}
              className={clsx(
                "row-span-2",
                warning && "accent-orange-800 dark:accent-red-300",
              )}
              handleChange={(filmConfig: FilmConfig) =>
                handleJoinChange({ film, filmConfig })
              }
            />
            <p className={pStyle}>{"" + film.time}</p>
          </label>
        );
      })}
    </div>
  );
}
