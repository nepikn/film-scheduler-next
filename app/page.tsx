"use client";

import Calendar from "@/components/ui/Calendar";
import IcsDownloadLink from "@/components/ui/IcsDownloadLink";
import NameFilter from "@/components/ui/NameFilter";
import Table from "@/components/ui/Table";
import ViewNav from "@/components/ui/ViewNav";
import Aside from "@/components/ui/aside";
import type { CheckConfig, FilmConfig } from "@/lib/definitions";
import type Film from "@/lib/film";
import { getLocalConstructor, setLocalConstructor } from "@/lib/localforage";
import View from "@/lib/view";
import useViewReducer from "@/lib/viewReducer";
import localforage from "localforage";
import { useEffect, useState } from "react";

export default function App() {
  console.group("app");
  // localforage.clear();
  const [{ filterStatusGroup, viewHint, userViews }, dispatch] =
    useViewReducer();
  const [removedSuggestViews, setRemovedSuggestViews] = useState(
    new Set<View["id"]>(),
  );

  // console.log([viewHint, filterStatusGroup]);
  const filterStatus =
    filterStatusGroup[
      userViews.find((view) => view.id == viewHint) ? viewHint : "suggestViews"
    ];
  const suggestViews = filterStatus.getSuggestViews(removedSuggestViews);
  const filteredFilms = filterStatus.getFilteredFilms();
  const view =
    (viewHint == "firstSuggestView"
      ? suggestViews[0]
      : [...userViews, ...suggestViews].find((v) => v.id == viewHint)) ??
    new View();

  useEffect(() => {
    // console.log("get");

    getLocalConstructor().then((val) => {
      if (!val) return;

      dispatch({ type: "localize", localConstructor: val });
    });
  }, [dispatch]);

  useEffect(() => {
    // console.log("set");

    setLocalConstructor({
      filterStatusGroup: filterStatusGroup,
      userViews: userViews,
    });
  }, [filterStatusGroup, userViews]);

  console.groupEnd();
  return (
    <main className="m-auto grid gap-8 px-16 py-8">
      <div className="grid gap-2">
        <div className="grid gap-2">
          <NameFilter check={filterStatus} handleChange={handleFilterChange} />
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <ViewNav
              handleViewChange={(view: View) =>
                dispatch({ type: "changeView", nextView: view })
              }
              handleViewRemove={handleViewRemove}
              viewGroups={[userViews, suggestViews]}
              curViewId={view.id}
            />
            <IcsDownloadLink {...{ filteredFilms, view }} />
          </div>
        </div>
        <Calendar
          view={view}
          dateCheck={filterStatus.date}
          filteredFilms={filteredFilms}
          handleFilterChange={handleFilterChange}
          handleJoinChange={handleFilmInputChange}
        />
      </div>
      {/* <Table
        view={view}
        filteredFilms={filteredFilms}
        handleChange={handleCalendarTableChange}
      /> */}
      <Aside
        handleNameFilterReverse={() => dispatch({ type: "reverseNameFilter" })}
        handleNameFilterClear={() => dispatch({ type: "clearNameFilter" })}
      />
    </main>
  );

  function handleViewRemove(removedView: View) {
    setRemovedSuggestViews(new Set([...removedSuggestViews, removedView.id]));
    dispatch({
      type: "removeView",
      removedView: removedView,
      currentView: view,
      views: [...userViews, ...suggestViews],
    });
  }

  function handleFilterChange(checkConfig: CheckConfig) {
    dispatch({
      type: "changeFilter",
      checkConfig: checkConfig,
    });
  }

  function handleFilmInputChange(this: Film, filmConfig: FilmConfig) {
    dispatch({
      type: "changeFilmInput",
      view: view,
      viewConfig: {
        film: this,
        filmConfig: filmConfig,
      },
    });
  }
}
