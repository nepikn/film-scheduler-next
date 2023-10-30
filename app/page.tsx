"use client";

import React, { useRef, useState } from "react";
import Film from "./Film";
import Filter from "./Filter";
import View, { ViewGroup } from "./View";
import Calendar from "../components/Calendar";
import NameFilter from "../components/NameFilter";
import ViewNav from "../components/ViewNav";
import Table from "../components/Table";
import { FilterCheckbox, TableInput, ViewRadio } from "../components/Input";
import { getItem } from "localforage";

export default function App() {
  // const userData = getItem()
  const [filter, setFilter] = useState(new Filter());
  const [validViews, setValidViews] = useState(() => filter.validViews);
  const [userViews, setUserViews] = useState([new View()]);
  const [viewId, setViewId] = useState(userViews[0].id);
  const view = [...userViews, ...validViews].find((v) => v.id == viewId)!;
  if (!view) {
    throw new Error("no such viewId");
  }
  const viewGroups: ViewGroup[] = [
    {
      id: "0",
      title: "自\n訂",
      views: userViews,
      setViews: setUserViews,
    },
    {
      id: "1",
      title: "生\n成",
      views: validViews,
      setViews: setValidViews,
    },
  ];

  return (
    <main className="m-auto grid px-16 gap-8 py-8">
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
    const [prevViewId, nextViewId] = [1, -1].map(
      (offset) =>
        [...userViews, ...validViews].find(
          (_, i, arr) => arr[i + offset]?.id == targViewId
        )?.id
    );

    // though there shouldn't exist a remove button
    if (prevViewId == undefined) {
      alert("First user view cannot be removed.");
      return;
    }
    if (targViewId == viewId) {
      setViewId(nextViewId ?? prevViewId);
    }

    this.setViews(this.views.filter((v) => v.id != targViewId));
  }

  // function handleChange(e: React.FormEvent) {
  //   const input = e.target;
  //   if (!(input instanceof HTMLInputElement)) return;

  //   if (input.name == "view") {
  //     // const view = [...userViews.current, ...validViews.current].find(
  //     //   (v) => v.id == input.value
  //     // );

  //     // if (!view) {
  //     //   console.log();

  //     // }
  //     // setView();
  //     return;
  //   }

  //   const targFilmId = input.dataset.id;
  //   if (!targFilmId) {
  //     handleFilterChange(input as FilterCheckbox);
  //     return;
  //   }

  //   const film = Film.instances.find((film) => film.id == targFilmId);
  //   if (!film) {
  //     console.log("handleChange: cannot find input's datd-id " + targFilmId);

  //     return;
  //   }

  //   // handleCalendarTableChange(input as TableInput, film);
  // }

  function handleFilterChange(input: FilterCheckbox) {
    const nextFilter = new Filter(filter, input);
    const nextViews = nextFilter.validViews;
    // console.log(nextViews);

    setValidViews(nextViews);
    setViewId(nextViews[0]?.id ?? userViews[0].id);
    setFilter(nextFilter);
  }

  function handleCalendarTableChange(this: Film, input: TableInput) {
    const userViewIndex = userViews.findIndex((v) => v.id == viewId);
    const nextView = new View(view.join, input, this);

    setViewId(nextView.id);
    setUserViews(
      userViewIndex == -1
        ? [...userViews, nextView]
        : userViews.toSpliced(userViewIndex, 1, nextView)
    );
  }
}
