"use client";

import Calendar from "@/components/ui/Calendar";
import IcsDownloader from "@/components/ui/IcsDownloader";
import NameFilter from "@/components/ui/NameFilter";
import ViewNav from "@/components/ui/ViewNav";
import { DateFilterAside, NameFilterAside } from "@/components/ui/aside";
import type { LocalState, StatusConfig, ViewConfig } from "@/lib/definitions";
import { useLocalEffect } from "@/lib/localforage";
import View from "@/lib/view";
import useViewReducer from "@/lib/viewReducer";
import { useCallback } from "react";

export default function App() {
  const [state, dispatch] = useViewReducer();
  const { viewId, userViewId, userViews, filterStatusGroup } = state;
  console.group("app");
  console.log(
    "ids %o",
    userViews.map((v) => v.id),
  );
  console.groupEnd();
  const viewingSuggests = viewId != userViewId;
  const filterStatus = filterStatusGroup[viewId];
  const suggestViews = filterStatus.getSuggestViews();
  const filteredFilms = filterStatus.getFilteredFilms();
  const views = [...userViews, ...suggestViews];
  const view = View.find(views, viewId) ?? new View();

  useLocalEffect(
    state,
    useCallback(
      (localState: LocalState) => dispatch({ type: "localize", localState }),
      [dispatch],
    ),
  );

  return (
    <main className="m-auto grid gap-8 py-8">
      <DateFilterAside
        viewingSuggests={viewingSuggests}
        handlers={{
          selectWeekend: () => dispatch({ type: "selectWeekend" }),
          selectWeekdayMorn: () => dispatch({ type: "selectWeekdayMorn" }),
          reset: () => dispatch({ type: "resetDateFilter" }),
        }}
      />
      <div className="grid gap-4 mx-16">
        <div className="grid gap-4">
          <NameFilter
            status={filterStatus.name}
            handleChange={handleFilterChange}
          />
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <ViewNav
              viewId={view.id}
              userViewId={userViewId}
              viewGroups={[userViews, suggestViews]}
              handlers={{
                copy: handleViewCopy,
                change: handleViewChange,
                remove: handleViewRemove,
              }}
            />
            <IcsDownloader {...{ filteredFilms, view }} />
          </div>
        </div>
        <Calendar
          {...{
            view,
            filteredFilms,
            handleFilterChange,
            dateFilterStatus: filterStatus.date,
            handleJoinChange: handleFilmInputChange,
          }}
        />
      </div>
      {/* <Table
        view={view}
        filteredFilms={filteredFilms}
        handleChange={handleCalendarTableChange}
      /> */}
      <NameFilterAside
        viewingSuggests={viewingSuggests}
        handlers={{
          all: () => dispatch({ type: "allNameFilter" }),
          clear: () => dispatch({ type: "clearNameFilter" }),
        }}
      />
    </main>
  );

  function handleViewCopy() {
    dispatch({ type: "copyUserView", views });
  }

  function handleViewChange(nextView: View) {
    dispatch({ type: "changeView", nextView });
  }

  function handleViewRemove(removedView: View) {
    dispatch({ type: "removeView", removedView, views });
  }

  function handleFilterChange(statusConfig: StatusConfig) {
    dispatch({ type: "changeFilter", statusConfig });
  }

  function handleFilmInputChange(viewConfig: ViewConfig) {
    dispatch({ type: "changeFilmInput", view, viewConfig });
  }
}
