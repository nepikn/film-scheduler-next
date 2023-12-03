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
  // localforage.getItem("localConfig").then((v) => console.log(v));
  const [{ checkStatusGroup, viewId, userViews }, dispatch] = useViewReducer();
  const [removedSuggestViews, setRemovedSuggestViews] = useState(
    new Set<View["id"]>(),
  );
  console.log({ checkStatusGroup, viewId, userViews });

  const checkStatus =
    checkStatusGroup[viewId] ?? checkStatusGroup["suggestViews"];
  const suggestViews = checkStatus.getShownsuggestViews(/* removedSuggestViews */);
  const filteredFilms = checkStatus.getFilteredFilms();
  const view = [
    ...userViews,
    ...suggestViews,
    new View(undefined, undefined, undefined, "fallback"),
  ].find((v) => v.id == viewId)!;

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
      checkStatusGroup: checkStatusGroup,
      userViews: userViews,
    });
  }, [checkStatusGroup, userViews]);

  console.groupEnd();
  return (
    <main className="m-auto grid gap-8 px-16 py-8">
      <div className="grid gap-2">
        <div className="grid gap-2">
          <NameFilter check={checkStatus} handleChange={handleFilterChange} />
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <ViewNav
              handleViewChange={(view: View) =>
                dispatch({ type: "changeView", nextView: view })
              }
              handleViewRemove={handleViewRemove}
              viewGroups={[userViews, suggestViews]}
              curViewId={viewId}
            />
            <IcsDownloadLink {...{ filteredFilms, view }} />
          </div>
        </div>
        <Calendar
          view={view}
          dateCheck={checkStatus.date}
          filteredFilms={filteredFilms}
          handleFilterChange={handleFilterChange}
          handleJoinChange={handleCalendarTableChange}
        />
      </div>
      {/* <Table
        view={view}
        filteredFilms={filteredFilms}
        handleChange={handleCalendarTableChange}
      /> */}
      <Aside
        handleNameFilterReverse={() => dispatch({ type: "reverseNameCheck" })}
        handleNameFilterClear={() => dispatch({ type: "clearNameCheck" })}
      />
    </main>
  );

  function handleViewRemove(removedView: View) {
    const removedViewId = removedView.id;
    const getSiblingView = (offset: number) =>
      [...userViews, ...suggestViews].find(
        (_, i, views) => views[i - offset]?.id == removedViewId,
      );

    setRemovedSuggestViews(new Set([...removedSuggestViews, removedView.id]));
    dispatch({ type: "removeUserView", removedView: removedView });
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
    const newUserView = view.generateUserView({
      film: this,
      filmConfig: filmConfig,
    });

    dispatch({ type: "updateUserViews", newView: newUserView });
    dispatch({ type: "changeView", nextView: newUserView });
  }
}
