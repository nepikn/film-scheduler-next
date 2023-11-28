"use client";

import Calendar from "@/components/ui/Calendar";
import IcsDownloadLink from "@/components/ui/IcsDownloadLink";
import NameFilter from "@/components/ui/NameFilter";
import Table from "@/components/ui/Table";
import ViewNav from "@/components/ui/ViewNav";
import Aside from "@/components/ui/aside";
import type { CheckConfig, FilmConfig } from "@/lib/definitions";
import type Film from "@/lib/film";
import { getLocalConfig, setLocalConfig } from "@/lib/localforage";
import type View from "@/lib/view";
import useViewReducer from "@/lib/viewReducer";
import localforage from "localforage";
import { useEffect } from "react";

export default function App() {
  const [{ check, viewId, userViews }, dispatch] = useViewReducer();
  const validViews = check.getShownValidViews();
  const filteredFilms = check.getFilteredFilms();
  const view = [...userViews, ...validViews].find((v) => v.id == viewId)!;
  // console.log(userViews[0].id, viewId);

  if (!view) {
    console.log("no view");
  }

  useEffect(() => {
    getLocalConfig().then((val) => {
      if (!val) return;

      dispatch({ type: "localize", localConfig: val });
    });
  }, []);

  useEffect(() => {
    setLocalConfig({
      checkConstructor: check,
      userViewConstructors: userViews,
    });
  }, [check, userViews]);

  return (
    <main className="m-auto grid gap-8 px-16 py-8">
      <div className="grid gap-2">
        <div className="grid gap-2">
          <NameFilter check={check} handleChange={handleFilterChange} />
          <button onClick={() => localforage.clear()}>Clear</button>
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <ViewNav
              handleViewChange={(view: View) =>
                dispatch({ type: "changeView", nextView: view })
              }
              handleViewRemove={handleViewRemove}
              viewGroups={[userViews, validViews]}
              curViewId={view.id}
            />
            <IcsDownloadLink {...{ filteredFilms, view }} />
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
      <Aside
        handleNameFilterClear={() => dispatch({ type: "clearNameFilter" })}
      />
    </main>
  );

  function handleViewRemove(removedView: View) {
    const removedViewId = removedView.id;
    const getSiblingView = (offset: number) =>
      [...userViews, ...validViews].find(
        (_, i, views) => views[i - offset]?.id == removedViewId,
      );

    dispatch({ type: "removeView", removedView: removedView });
    dispatch({
      type: "changeView",
      nextView:
        removedViewId == viewId
          ? getSiblingView(1) ?? getSiblingView(-1)!
          : view,
    });
  }

  function handleFilterChange(checkConfig: CheckConfig) {
    dispatch({
      type: "updateCheck",
      checkConfig: checkConfig,
    });
  }

  function handleCalendarTableChange(this: Film, filmConfig: FilmConfig) {
    const newView = view.generateByConfig({
      film: this,
      filmConfig: filmConfig,
    });

    dispatch({ type: "updateUserViews", newView: newView });
    dispatch({ type: "changeView", nextView: newView });
  }
}
