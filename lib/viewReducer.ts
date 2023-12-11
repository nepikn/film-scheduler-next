"use client";

import { useReducer } from "react";
import FilterStatus from "./filterStatus";
import {
  CheckConfig,
  FilmConfig,
  LocalConstructor,
  ViewConfig,
} from "./definitions";
import View from "./view";
import Film from "./film";

export default function useViewReducer() {
  return useReducer(reducer, null, getInitialState);
}

type ViewState = {
  viewId: View["id"];
  userViewId: View["id"];
  userViews: View[];
  // filterStatus: FilterStatus;
  filterStatusGroup: {
    [userViewId: ViewState["userViewId"]]: FilterStatus;
  };
};

export function getInitialState(): ViewState {
  const joinIds = {
    熱帶的甜蜜: "7b5cc6c1-0bdb-5107-8785-e5f3785417fe",
    莊園魅影: "7085eaf3-68d3-5684-8fb6-a5c730ab0d5c",
    漂流人生: "b522f98f-7a91-5ef2-af9e-28a430467c10",
    "麗芙烏曼：幽徑綺思": undefined,
  };
  const userViews = [new View({ joinIds: joinIds }), new View(), new View()];
  const id = userViews[0].id;
  const status = new FilterStatus({
    name: Object.fromEntries(Object.keys(joinIds).map((key) => [key, true])),
  });

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
  | { type: "localize"; localConstructor: LocalConstructor }
  | { type: "changeFilmInput"; view: View; viewConfig: ViewConfig }
  | { type: "reverseNameFilter" }
  | { type: "clearNameFilter" }
  | {
      type: "changeFilter";
      checkConfig: CheckConfig;
    }
  | { type: "changeView"; nextView: View }
  | {
      type: "removeView";
      removedView: View;
      currentView: View;
      views: View[];
    };

function reducer(state: ViewState, action: Action): ViewState {
  const { viewId, userViewId, userViews, filterStatusGroup: group } = state;
  const isUserViewGroup = viewId == userViewId;
  const filterStatus = group[viewId];

  switch (action.type) {
    case "reverseNameFilter": {
      if (!isUserViewGroup) {
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
      const userViews = action.localConstructor.userViews?.map(
        (construtor) =>
          new View({
            joinIds: construtor.joiningIds,
            randomOrId: construtor.id,
          }),
      );
      const localStatus = action.localConstructor.filterStatusGroup;
      const statusGroup = Object.fromEntries(
        Object.entries(localStatus).map(([id, constructor]) => [
          id,
          new FilterStatus(constructor),
        ]),
      );
      const id = userViews[0].id;

      return {
        ...state,
        viewId: id,
        userViewId: id,
        userViews: userViews,
        filterStatusGroup: generateGroup(id, statusGroup[id]),
      };
    }

    case "changeFilmInput": {
      const newUserView = new View({
        joinIds: action.view.joiningIds,
        config: action.viewConfig,
      });

      return {
        ...state,
        viewId: newUserView.id,
        userViewId: newUserView.id,
        userViews: userViews.toSpliced(
          isUserViewGroup
            ? userViews.findIndex((v) => v.id == viewId)
            : userViews.length,
          1,
          newUserView,
        ),
        filterStatusGroup: generateGroup(newUserView.id, filterStatus),
      };
    }

    case "removeView": {
      const removedId = action.removedView.id;
      const nextUserViewId = removedId == userViewId ? userViews[0].id : viewId;

      return {
        ...state,
        viewId: nextUserViewId,
        userViewId: nextUserViewId,
        userViews: userViews.filter((v) => v.id != removedId),
      };
    }

    case "changeFilter": {
      const id = isUserViewGroup ? viewId : userViewId;

      return {
        ...state,
        viewId: id,
        filterStatusGroup: generateGroup(
          id,
          new FilterStatus(filterStatus, action.checkConfig),
        ),
      };
    }

    case "clearNameFilter": {
      if (!isUserViewGroup) {
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

  function generateGroup(
    viewId: View["id"],
    status: FilterStatus,
  ): ViewState["filterStatusGroup"] {
    return {
      ...group,
      [viewId]: status,
    };
  }
}
