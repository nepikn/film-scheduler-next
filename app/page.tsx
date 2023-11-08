"use client";

import React, { useRef, useState } from "react";
import Film from "../lib/Film";
import Filter from "../lib/Filter";
import View, { ViewGroup } from "../lib/View";
import Calendar from "../components/ui/Calendar";
import NameFilter from "../components/ui/NameFilter";
import ViewNav from "../components/ui/ViewNav";
import Table from "../components/ui/Table";
import { FilterCheckbox, TableInput, ViewRadio } from "../components/ui/Input";
import { getItem, setItem } from "localforage";
import useLocalStorage from "@/lib/localStorage";

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
          <ViewNav
            handleViewRemove={handleViewRemove}
            handleViewChange={(id: string) => setViewId(id)}
            viewGroups={viewGroups}
            curViewId={viewId}
          />
        </div>
        <Calendar
          view={view}
          filter={filter}
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
