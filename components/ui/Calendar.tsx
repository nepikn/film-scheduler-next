"use client";

import { useState } from "react";
import {
  eachWeekOfInterval,
  eachDayOfInterval,
  previousSunday,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSunday,
} from "date-fns";
import Film from "../../lib/film";
import View from "../../lib/view";
import FilmInput from "./Input";
import { FilmConfig } from "@/lib/definitions";
import FilterStatus from "../../lib/check";
import clsx from "clsx";
import { CheckConfig } from "@/lib/definitions";

interface CalendarProp {
  view: View;
  dateCheck: FilterStatus["date"];
  filteredFilms: Film[];
  handleFilterChange: (k: CheckConfig) => void;
  handleJoinChange: (this: Film, input: FilmConfig) => void;
}

export default function Calendar({
  view,
  dateCheck,
  filteredFilms,
  handleFilterChange,
  handleJoinChange,
}: CalendarProp) {
  console.group("cal");
  const [monthStart, setMonthStart] = useState(new Date("2023-11"));
  const sortFilms = [...filteredFilms].sort((a, b) =>
    view.getSkipStatus(a) == view.getSkipStatus(b)
      ? +a.time.start - +b.time.start
      : view.getSkipStatus(a)
      ? 1
      : -1,
  );
  const weeks = eachWeekOfInterval({
    start: isSunday(monthStart) ? monthStart : previousSunday(monthStart),
    end: endOfMonth(monthStart),
  }).map((sun) => (
    <fieldset key={sun.getTime()} className="grid grid-cols-7 divide-x">
      {eachDayOfInterval({ start: sun, end: endOfWeek(sun) }).map((date) => (
        <div
          key={date.getTime()}
          className="space-y-3 border-neutral-300 p-4 py-3"
        >
          {date.getMonth() == monthStart.getMonth() && (
            <>
              <DateFilter
                isChecked={dateCheck[date.getDate()]}
                date={date.getDate()}
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

  console.groupEnd();
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
            <li key={title} className="font-bold">
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
  isChecked: boolean;
  date: number;
  handleChange: CalendarProp["handleFilterChange"];
}

function DateFilter({ isChecked, date, handleChange }: DateFilter) {
  return (
    <label className="cursor-pointer hover:text-gray-400">
      <input
        type="checkbox"
        name={"date"}
        value={date}
        checked={isChecked}
        className="hidden"
        onChange={(e) =>
          handleChange({
            type: "date",
            filmNameOrMonthDate: date,
            checked: e.target.checked,
          })
        }
      />
      <p
        className={`whitespace-nowrap text-right leading-none ${
          isChecked ? "no-underline" : "text-gray-400 line-through decoration-4"
        }`}
      >
        {date}
      </p>
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
    <div className="max-h-48 space-y-2 overflow-auto px-2 pb-1 text-right">
      {films.map((film, i) => {
        const pClass = clsx("leading-none");
        const checked = filterStatus[i];
        const overlapSiblingAndBothChecked = () =>
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
              overlapSiblingAndBothChecked() &&
                "text-rose-400 dark:hover:text-rose-200",
            )}
          >
            <p className={clsx("font-semibold", pClass)}>{film.name}</p>
            <FilmInput
              prop="join"
              // val={view.getChecked(film)}
              film={film}
              // view={view}
              checked={checked}
              className={"row-span-2"}
              handleChange={handleJoinChange.bind(film)}
            />
            <p className={pClass}>{"" + film.time}</p>
          </label>
        );
      })}
    </div>
  );
}
