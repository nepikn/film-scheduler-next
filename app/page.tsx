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
import ViewGroup from "@/lib/viewGroup";
import useViewGroupReducer from "@/lib/viewReducer";
import IcsDownloadLink from "../components/ui/IcsDownloadLink";

export default function App() {
  const [userViews, setUserViews] = useLocalStorage<View[]>("userViews");
  const [state, dispatch] = useViewGroupReducer(userViews[0].id);
  console.log(state);

  const { check, viewId, viewRemoved } = state;
  const validViews = check.getValidViews().filter((v) => !viewRemoved[1][v.id]);
  const filteredFilms = check.getFilteredFilms();
  const view = [...userViews, ...validViews].find((v) => v.id == viewId)!;
  const viewGroupId = userViews.find((v) => v.id == view.id) ? 0 : 1;
  const viewGroups: ViewGroup[] = [
    {
      id: 0,
      // name: "user",
      title: "自\n訂",
      views: userViews,
      // setViews: setUserViews,
      handleViewRemove: handleViewRemove,
      isFirst: true,
    },
    {
      id: 1,
      // name: "valid",
      title: "生\n成",
      views: validViews,
      // setViews: setValidViews,
      handleViewRemove: handleViewRemove,
    },
  ].map((prop) => new ViewGroup(prop));

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
              viewGroups={viewGroups}
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
            viewGroupId: viewGroupId,
            fallbackViewId: userViews[0].id,
          })
        }
      />
    </main>
  );

  function handleViewRemove(this: ViewGroup, targViewId: string) {
    // const nextViewInfo = { ...viewInfo };
    let nextViewId = viewId;
    if (targViewId == view.id) {
      const [leftViewId, rightViewId] = [1, -1].map(
        (offset) =>
          [...userViews, ...validViews].find(
            (_, i, arr) => arr[i + offset]?.id == targViewId,
          )?.id,
      );
      
      nextViewId = rightViewId ?? leftViewId!;
    }

    dispatch({
      type: "removeView",
      targViewGroupId: this.id,
      targViewId: targViewId,
      nextViewId: nextViewId,
    });
    // this.setViews(this.views.filter((v) => v.id != targViewId));
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
      viewGroupId: viewGroupId,
      fallbackViewId: userViews[0].id,
    });
  }

  function handleCalendarTableChange(this: Film, filmConfig: FilmConfig) {
    const userViewIndex = userViews.findIndex((v) => v.id == viewId);
    const nextView = new View(view.joinIds, {
      film: this,
      filmConfig: filmConfig,
    });

    // setViewInfo(nextView.id);
    dispatch({ type: "changeView", viewId: nextView.id });
    setUserViews(
      // userViewIndex == -1
      viewGroupId == 1
        ? [...userViews, nextView]
        : userViews.toSpliced(
            userViewIndex,
            // view.id,
            1,
            nextView,
          ),
    );
  }
}
