"use client";

import Calendar from "@/components/ui/Calendar";
import { FilterCheckbox, TableInput } from "@/components/ui/Input";
import NameFilter from "@/components/ui/NameFilter";
import Table from "@/components/ui/Table";
import ViewNav from "@/components/ui/ViewNav";
import Film from "@/lib/film";
import Filter from "@/lib/filter";
import View, { ViewGroup } from "@/lib/view";
import { getIcsLink } from "@/lib/ics";
import useLocalStorage from "@/lib/useLocalStorage";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function App() {
  // const userData = getItem()
  const [filter, setFilter] = useLocalStorage<Filter>("filter");
  const [validViews, setValidViews] = useState(() => filter.validViews);
  const [userViews, setUserViews] = useLocalStorage<View[]>("userViews");
  const [viewId, setViewId] = useState(userViews[0].id);
  const view = [...userViews, ...validViews].find((v) => v.id == viewId)!;
  if (!view) {
    console.log("no such viewId");
  }
  const filteredFilms = filter.filteredFilms;
  const viewGroups: ViewGroup[] = [
    {
      id: "0",
      name: "userViews",
      title: "自\n訂",
      views: userViews,
      setViews: setUserViews,
    },
    {
      id: "1",
      name: "validViews",
      title: "生\n成",
      views: validViews,
      setViews: setValidViews,
    },
  ];

  return (
    <main className="m-auto grid gap-8 px-16 py-8">
      {/* <button
        onClick={() => {
          // localStorage.setItem("scheduler", JSON.stringify({}));
        }}
      >
        F
      </button> */}
      <div className="grid gap-2">
        <div className="grid gap-4">
          <NameFilter filter={filter} handleChange={handleFilterChange} />
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <ViewNav
              handleViewRemove={handleViewRemove}
              handleViewChange={(id: string) => setViewId(id)}
              viewGroups={viewGroups}
              curViewId={viewId}
            />
            <a
              download={"金馬.ics"}
              href={getIcsLink(
                filteredFilms.filter((film) => view.getChecked(film)),
              )}
              className="flex h-full items-center rounded border border-zinc-200 bg-white px-3 py-2 shadow-sm hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-neutral-600 dark:hover:text-zinc-50"
            >
              <span>下載 iCal</span>
            </a>
          </div>
        </div>
        <Calendar
          view={view}
          dateFilter={filter.date}
          filteredFilms={filteredFilms}
          handleFilterChange={handleFilterChange}
          handleJoinChange={handleCalendarTableChange}
        />
      </div>
      <Table
        view={view}
        filter={filter}
        handleChange={handleCalendarTableChange}
      />
    </main>
  );

  function handleViewRemove(this: ViewGroup, targView: View) {
    const targViewId = targView.id;

    if (targViewId == viewId) {
      const [prevViewId, nextViewId] = [1, -1].map(
        (offset) =>
          [...userViews, ...validViews].find(
            (_, i, arr) => arr[i + offset]?.id == targViewId,
          )?.id,
      );
      // no remove button for the first user view
      setViewId(nextViewId ?? prevViewId!);
    }

    this.setViews(this.views.filter((v) => v.id != targViewId));
  }

  function handleFilterChange(input: FilterCheckbox) {
    const nextFilter = new Filter(filter, input);
    const nextViews = nextFilter.validViews;
    // console.log(nextViews);

    setValidViews(nextViews);
    setFilter(nextFilter);
    if (validViews.find((v) => v.id == viewId)) {
      setViewId(nextViews[0]?.id ?? userViews[0].id);
    }
  }

  function handleCalendarTableChange(this: Film, input: TableInput) {
    const userViewIndex = userViews.findIndex((v) => v.id == viewId);
    const nextView = new View(view.join, input, this);

    setViewId(nextView.id);
    setUserViews(
      userViewIndex == -1
        ? [...userViews, nextView]
        : userViews.toSpliced(userViewIndex, 1, nextView),
    );
  }
}
