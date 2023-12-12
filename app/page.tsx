"use client";

import Calendar from "@/components/ui/Calendar";
import IcsDownloadLink from "@/components/ui/IcsDownloadLink";
import NameFilter from "@/components/ui/NameFilter";
import ViewNav from "@/components/ui/ViewNav";
import Aside from "@/components/ui/aside";
import type { CheckConfig, FilmConfig } from "@/lib/definitions";
import type Film from "@/lib/film";
import {
  clearLocalConstructor,
  getLocalConstructor,
  setLocalConstructor,
} from "@/lib/localforage";
import View from "@/lib/view";
import useViewReducer from "@/lib/viewReducer";
import { useEffect } from "react";

export default function App() {
  console.group("app");

  const [{ viewId, userViews, filterStatusGroup }, dispatch] = useViewReducer();
  // console.log("id %s group %o", viewId, filterStatusGroup);

  const filterStatus = filterStatusGroup[viewId];
  const suggestViews = filterStatus.getSuggestViews();
  const filteredFilms = filterStatus.getFilteredFilms();
  const view =
    [...userViews, ...suggestViews].find((v) => v.id == viewId) ?? new View();

  // console.log([view.id, userViews]);
  useEffect(() => {
    getLocalConstructor().then((val) => {
      if (!val) return;

      dispatch({ type: "localize", localConstructor: val });
    });
  }, [dispatch]);

  useEffect(() => {
    setLocalConstructor({
      filterStatusGroup,
      userViews,
    });
  }, [filterStatusGroup, userViews]);

  console.groupEnd();
  return (
    <main className="m-auto grid gap-8 px-16 py-8">
      <div className="grid gap-4">
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
        suggestView={!view.belongUserGroup}
        handleNameFilterReverse={() => dispatch({ type: "reverseNameFilter" })}
        handleNameFilterClear={() => dispatch({ type: "clearNameFilter" })}
      />
    </main>
  );

  function handleViewRemove(removedView: View) {
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
