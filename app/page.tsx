"use client";

import Calendar from "@/components/ui/Calendar";
import NameFilter from "@/components/ui/NameFilter";
import Table from "@/components/ui/Table";
import ViewNav from "@/components/ui/ViewNav";
import Aside from "@/components/ui/aside";
import type { FilmConfig, CheckConfig } from "@/lib/definitions";
import Film from "@/lib/film";
import useLocalStorage from "@/lib/useLocalStorage";
import View from "@/lib/view";
import useViewGroupReducer from "@/lib/viewReducer";
import IcsDownloadLink from "../components/ui/IcsDownloadLink";

export default function App() {
  const [userViews, setUserViews] = useLocalStorage<View[]>("userViews");
  const [state, dispatch] = useViewGroupReducer(userViews[0].id);
  console.log(state);

  const { check, viewId } = state;
  const validViews = check.getValidViews().filter((v) => !v.isRemoved);
  const filteredFilms = check.getFilteredFilms();
  const view = [...userViews, ...validViews].find((v) => v.id == viewId)!;
  const isUserViewGroup = view.groupId == View.userViewGroupId;

  if (!view) {
    console.log("no view");
  }

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
              handleViewChange={(viewId: string) =>
                dispatch({ type: "changeView", viewId: viewId })
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
        handleNameFilterClear={() =>
          dispatch({
            type: "clearNameFilter",
            nextViewId: isUserViewGroup ? viewId : userViews[0].id,
          })
        }
      />
    </main>
  );

  function handleViewRemove(removedView: View) {
    const removedViewId = removedView.id;
    const getSiblingViewId = (offset: number) =>
      [...userViews, ...validViews].find(
        (_, i, views) => views[i + offset]?.id == removedViewId,
      )?.id;

    removedView.remove();
    dispatch({
      type: "changeView",
      // targViewGroupId: targView.groupId,
      // targViewId: targViewId,
      viewId:
        removedViewId == viewId
          ? getSiblingViewId(-1) ?? getSiblingViewId(1)!
          : viewId,
    });
  }

  function handleFilterChange(checkConfig: CheckConfig) {
    // const nextCheck = new Check(check, checkConfig);
    // const nextViews = nextCheck.getValidViews();

    // setValidViews(nextViews);
    // setCheck(nextCheck);
    // if (validViews.find((v) => v.id == view.id)) {
    //   setViewInfo(nextViews[0]?.id ?? userViews[0].id);
    // }
    dispatch({
      type: "updateCheck",
      checkConfig: checkConfig,
      isUserViewGroup: isUserViewGroup,
      nextViewId: userViews[0].id,
    });
  }

  function handleCalendarTableChange(this: Film, filmConfig: FilmConfig) {
    // const userViewIndex = userViews.findIndex((v) => v.id == viewId);
    const nextView = new View(view.joinIds, {
      film: this,
      filmConfig: filmConfig,
    });

    // setViewInfo(nextView.id);
    dispatch({ type: "changeView", viewId: nextView.id });
    setUserViews(
      // userViewIndex == -1
      userViews.toSpliced(
        isUserViewGroup
          ? userViews.findIndex((v) => v.id == viewId)
          : userViews.length,
        1,
        nextView,
      ),
    );
  }
}
