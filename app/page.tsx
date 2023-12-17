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
  // console.group("app");
  // console.log("id %s group %o", viewId, filterStatusGroup);
  // console.groupEnd();
  const filterStatus = filterStatusGroup[viewId];
  const suggestViews = filterStatus.getSuggestViews();
  const filteredFilms = filterStatus.getFilteredFilms();
  const views = [...userViews, ...suggestViews];
  const view = views.find((v) => v.id == viewId) ?? new View();

  useLocalEffect(
    state,
    useCallback(
      (localState: LocalState) => dispatch({ type: "localize", localState }),
      [dispatch],
    ),
  );

  return (
    <main className="m-auto grid gap-8 px-16 py-8">
      <DateFilterAside
        isUserView={view.belongUserGroup}
        handlers={{
          selectWeekend: () => dispatch({ type: "selectWeekend" }),
          selectWeekdayMorn: () => dispatch({ type: "selectWeekdayMorn" }),
          reset: () => dispatch({ type: "resetDateFilter" }),
        }}
      />
      <div className="grid gap-4">
        <div className="grid gap-2">
          <NameFilter
            status={filterStatus.name}
            handleChange={handleFilterChange}
          />
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <ViewNav
              {...{
                userViewId,
                handleViewChange,
                handleViewRemove,
                viewId: view.id,
                viewGroups: [userViews, suggestViews],
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
        isUserView={view.belongUserGroup}
        handlers={{
          reverse: () => dispatch({ type: "reverseNameFilter" }),
          clear: () => dispatch({ type: "clearNameFilter" }),
        }}
      />
    </main>
  );

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
