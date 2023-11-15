"use client";

import Calendar from "@/components/ui/Calendar";
import NameFilter from "@/components/ui/NameFilter";
import Table from "@/components/ui/Table";
import ViewNav from "@/components/ui/ViewNav";
import Aside from "@/components/ui/aside";
import type {
  Action,
  FilmConfig,
  CheckConfig,
  ViewGroup,
} from "@/lib/definitions";
import Film from "@/lib/film";
import Check from "@/lib/check";
import getIcsLink from "@/lib/ics";
import useLocalStorage from "@/lib/useLocalStorage";
import View from "@/lib/view";
import { useState } from "react";

export default function App() {
  const [check, setCheck] = useLocalStorage<Check>("check");
  const [validViews, setValidViews] = useState(() => check.getValidViews());
  const [userViews, setUserViews] = useLocalStorage<View[]>("userViews");
  const [viewId, setViewId] = useState(userViews[0].id);
  const view = [...userViews, ...validViews].find((v) => v.id == viewId)!;
  if (!view) {
    console.log("no such viewId");
  }
  const filteredFilms = check.getFilteredFilms();
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
        <div className="grid gap-2">
          <NameFilter check={check} handleChange={handleFilterChange} />
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
                filteredFilms.filter((film) => view.getJoinStatus(film)),
              )}
              className="flex h-full items-center rounded border border-zinc-200 bg-white px-3 py-3 leading-none shadow-sm hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-neutral-600 dark:hover:text-zinc-50"
            >
              <span>下載 iCal</span>
            </a>
          </div>
        </div>
        <Calendar
          view={view}
          dateCheck={check.date}
          filteredFilms={filteredFilms}
          handleFilterChange={handleFilterChange}
          handleJoinChange={handleCalendarTableChange}
        />
      </div>
      <Table
        view={view}
        filteredFilms={filteredFilms}
        handleChange={handleCalendarTableChange}
      />
      <Aside handleClick={handleAsideClick} />
    </main>
  );

  function handleAsideClick(this: Action) {
    switch (this.type) {
      case "clear":
        setCheck(new Check({ ...check, name: {} }));
        setValidViews([]);
        break;

      default:
        break;
    }
  }

  function handleViewRemove(this: ViewGroup, targViewId: string) {
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

  function handleFilterChange(checkConfig: CheckConfig) {
    const nextCheck = new Check(check, checkConfig);
    const nextViews = nextCheck.getValidViews();

    setValidViews(nextViews);
    setCheck(nextCheck);
    if (validViews.find((v) => v.id == viewId)) {
      setViewId(nextViews[0]?.id ?? userViews[0].id);
    }
  }

  function handleCalendarTableChange(this: Film, filmConfig: FilmConfig) {
    const userViewIndex = userViews.findIndex((v) => v.id == viewId);
    const nextView = new View(view.join, {
      film: this,
      filmConfig: filmConfig,
    });

    setViewId(nextView.id);
    setUserViews(
      userViewIndex == -1
        ? [...userViews, nextView]
        : userViews.toSpliced(userViewIndex, 1, nextView),
    );
  }
}
