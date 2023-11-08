import { useState } from "react";
import {
  eachWeekOfInterval,
  eachDayOfInterval,
  previousSunday,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSunday,
  format,
} from "date-fns";
import Film from "../../lib/Film";
import View from "../../lib/View";
import Input, { FilterCheckbox, TableInput } from "./Input";
import Filter from "../../lib/Filter";

interface CalendarProp {
  view: View;
  filter: Filter;
  handleFilterChange: (input: FilterCheckbox) => void;
  handleJoinChange: (this: Film, input: TableInput) => void;
}

export default function Calendar({
  view,
  filter,
  handleFilterChange,
  handleJoinChange,
}: CalendarProp) {
  const [monthStart, setMonthStart] = useState(new Date("2023-11"));
  const sortFilms = filter.validFilms
    .slice()
    .sort((a, b) =>
      view.getSkipped(a) == view.getSkipped(b)
        ? +a.time.start - +b.time.start
        : view.getSkipped(a)
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
          {date.getMonth() == monthStart.getMonth() ? (
            <DateFilter
              filter={filter}
              date={date}
              handleChange={handleFilterChange}
            />
          ) : (
            ""
          )}
          <Agenda
            dayFilms={sortFilms.filter((film) =>
              isSameDay(film.time.start, date),
            )}
            view={view}
            handleJoinChange={handleJoinChange}
          />
        </div>
      ))}
    </fieldset>
  ));

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
  filter: Filter;
  date: Date;
  handleChange: CalendarProp["handleFilterChange"];
}

function DateFilter({ filter, date, handleChange }: DateFilter) {
  const time = date.getDate();
  const isChecked = filter.date[time];
  return (
    <label className="cursor-pointer hover:text-gray-400">
      <input
        type="checkbox"
        name={"date"}
        value={time}
        checked={isChecked}
        className="hidden"
        onChange={(e) => handleChange(e.target as FilterCheckbox)}
      />
      <p
        className={`whitespace-nowrap text-right leading-none ${
          isChecked ? "no-underline" : "text-gray-400 line-through decoration-4"
        }`}
      >
        {date.getDate()}
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
  return (
    <fieldset className="max-h-32 space-y-2 overflow-auto px-2 pb-1 text-right">
      {films.map((film) => (
        <label
          key={film.id}
          className={`grid cursor-pointer grid-cols-[1fr_auto] gap-x-2 gap-y-1 hover:text-gray-500 dark:hover:text-gray-300 ${
            view.getSkipped(film) ? "text-gray-400" : "font-semibold"
          }`}
        >
          <p className="leading-none">{film.name}</p>
          <Input
            name="join"
            // val={view.getChecked(film)}
            film={film}
            view={view}
            disabled={film.isSoldout}
            className="row-span-2"
            handleChange={handleJoinChange.bind(film)}
          />
          <p className="font-normal leading-none">{"" + film.time}</p>
        </label>
      ))}
    </fieldset>
  );
}
