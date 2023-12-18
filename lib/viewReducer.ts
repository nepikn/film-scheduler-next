"use client";

import { useReducer } from "react";
import FilterStatus from "./filterStatus";
import { StatusConfig, LocalState, ViewConfig } from "./definitions";
import View from "./view";
import Film from "./film";
import { ViewState } from "./definitions";
import { isWeekend, parseISO } from "date-fns";

export default function useViewReducer() {
  return useReducer(reducer, null, getInitialState);
}

export function getInitialState(): ViewState {
  const joinIds = {
    熱帶的甜蜜: "7b5cc6c1-0bdb-5107-8785-e5f3785417fe",
    莊園魅影: "7085eaf3-68d3-5684-8fb6-a5c730ab0d5c",
    漂流人生: "b522f98f-7a91-5ef2-af9e-28a430467c10",
    "麗芙烏曼：幽徑綺思": undefined,
  };
  const userViews = [new View({ joinIds }), new View(), new View()];
  const id = userViews[0].id;
  const status = new FilterStatus({
    name: Object.fromEntries(Object.keys(joinIds).map((key) => [key, true])),
  });

  status.date[+parseISO("2023-11-12")] = false;
  status.date[+parseISO("2023-11-14")] = false;
  status.date[+parseISO("2023-11-15")] = false;

  return {
    viewId: id,
    userViewId: id,
    userViews: userViews,
    filterStatusGroup: {
      [id]: status,
      [userViews[1].id]: new FilterStatus({
        name: { 燃冬: true, 霧中潛行: true },
      }),
      [userViews[2].id]: new FilterStatus({
        name: { "白雲蒼狗＼鷺鷥河＼夏夢迴＼幽暗小徑的鬼＼纏": true },
      }),
    },
  };
}

type Action =
  | { type: "localize"; localState: LocalState }
  | { type: "selectWeekend" }
  | { type: "selectWeekdayMorn" }
  | { type: "resetDateFilter" }
  | { type: "changeFilmInput"; view: View; viewConfig: ViewConfig }
  | { type: "reverseNameFilter" }
  | { type: "clearNameFilter" }
  | {
      type: "changeFilter";
      statusConfig: StatusConfig;
    }
  | { type: "copyUserView"; views: View[] }
  | { type: "changeView"; nextView: View }
  | {
      type: "removeView";
      removedView: View;
      views: View[];
    };

function reducer(state: ViewState, action: Action): ViewState {
  const { viewId, userViewId, userViews, filterStatusGroup: group } = state;
  const viewingSuggests = viewId != userViewId;
  const filterStatus = group[userViewId];

  function generateGroup(
    targViewId: View["id"],
    status: FilterStatus,
    statusGroup = group,
  ) {
    return {
      ...statusGroup,
      [targViewId]: status,
    } as ViewState["filterStatusGroup"];
  }

  switch (action.type) {
    case "selectWeekend": {
      return {
        ...state,
        filterStatusGroup: generateGroup(
          viewId,
          new FilterStatus(filterStatus, {
            type: "date",
            status: Object.fromEntries(
              Object.keys(filterStatus.date).map((time) => [
                time,
                isWeekend(+time),
              ]),
            ),
          }),
        ),
      };
    }

    case "selectWeekdayMorn": {
      return {
        ...state,
        filterStatusGroup: generateGroup(
          viewId,
          new FilterStatus(filterStatus, {
            type: "date",
            status: Object.fromEntries(
              Object.keys(filterStatus.date).map((time) => [
                time,
                !isWeekend(+time),
              ]),
            ),
          }),
        ),
      };
    }

    case "resetDateFilter": {
      return {
        ...state,
        filterStatusGroup: generateGroup(
          viewId,
          new FilterStatus({ ...filterStatus, date: undefined }),
        ),
      };
    }

    case "reverseNameFilter": {
      if (viewingSuggests) {
        return state;
      }

      const status = new FilterStatus(filterStatus, {
        type: "name",
        status: Object.fromEntries(
          Array.from(Film.names).map((filmName) => [
            filmName,
            !filterStatus.name[filmName],
          ]),
        ),
      });

      return {
        ...state,
        filterStatusGroup: generateGroup(viewId, status),
      };
    }

    case "changeView": {
      const nextView = action.nextView;
      const nextId = nextView.id;
      const nextUserViewId = nextView.belongUserGroup ? nextId : userViewId;

      return {
        ...state,
        viewId: nextId,
        userViewId: nextUserViewId,
        filterStatusGroup: generateGroup(nextId, group[nextUserViewId]),
      };
    }

    case "localize": {
      const userViews = action.localState.userViews?.map(
        (construtor) =>
          new View({
            joinIds: construtor.joinIds,
            randomOrId: construtor.id,
          }),
      );
      const localGroup = action.localState.filterStatusGroup;
      const group = Object.fromEntries(
        Object.entries(localGroup).map(([id, constructor]) => [
          id,
          new FilterStatus(constructor),
        ]),
      );
      const id = userViews[0].id;

      return {
        viewId: id,
        userViewId: id,
        userViews: userViews,
        filterStatusGroup: group,
      };
    }

    case "copyUserView":
    case "changeFilmInput": {
      const index = userViews.findIndex((view) => view.id == userViewId);
      const copying = action.type == "copyUserView";
      const newView = copying
        ? new View({
            joinIds: action.views.find((view) => view.id == viewId)?.joinIds,
          })
        : action.view.getConfigured(action.viewConfig);
      const nextId = newView.id;

      return {
        viewId: nextId,
        userViewId: nextId,
        userViews:
          copying || viewingSuggests
            ? userViews.toSpliced(index + 1, 0, newView)
            : userViews.toSpliced(index, 1, newView),
        filterStatusGroup: generateGroup(nextId, filterStatus),
      };
    }

    case "removeView": {
      const removedId = action.removedView.id;
      const nextState = {
        ...state,
        userViews: userViews.filter((v) => v.id != removedId),
      };

      if (removedId == userViewId) {
        const findSibling = (offset: number) =>
          userViews.find((_, i) => userViews[i + offset]?.id == userViewId);

        nextState.viewId = nextState.userViewId = (
          findSibling(-1) ??
          findSibling(1) ??
          userViews[0]
        ).id;
      }

      return nextState;
    }

    case "changeFilter": {
      const id = viewingSuggests ? userViewId : viewId;

      return {
        ...state,
        viewId: id,
        filterStatusGroup: generateGroup(
          id,
          new FilterStatus(filterStatus, action.statusConfig),
        ),
      };
    }

    case "clearNameFilter": {
      if (viewingSuggests) {
        return state;
      }

      return {
        ...state,
        filterStatusGroup: generateGroup(
          viewId,
          new FilterStatus(filterStatus, { type: "name", status: {} }),
        ),
      };
    }
  }
}
