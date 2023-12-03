"use client";

import { useReducer } from "react";
import FilterStatus from "./check";
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
  viewHint: View["id"];
  userViews: View[];
  filterStatus: FilterStatus;
  filterStatusGroup: {
    [k: View["id"]]: FilterStatus;
    suggestViews: FilterStatus;
  };
};
export function getInitialState(): ViewState {
  const userViews = [new View(), new View()];
  const id = userViews[0].id;
  const status = new FilterStatus();

  return {
    viewHint: id,
    userViews: userViews,
    filterStatus: status,
    filterStatusGroup: {
      [id]: status,
      [userViews[1].id]: status,
      suggestViews: status,
    },
  };
}

type Action =
  | { type: "reverseNameFilter" }
  | { type: "localize"; localConstructor: LocalConstructor }
  | { type: "changeFilmInput"; view: View; viewConfig: ViewConfig }
  | {
      type: "clearNameFilter";
    }
  | {
      type: "changeFilter";
      checkConfig: CheckConfig;
    }
  | {
      type: "removeView";
      removedView: View;
      currentView: View;
      views: View[];
    }
  | { type: "changeView"; nextView: View };

function reducer(state: ViewState, action: Action): ViewState {
  const {
    viewHint: viewId,
    userViews,
    filterStatus,
    filterStatusGroup,
  } = state;
  const isUserViewGroup = !!userViews.find((v) => v.id == viewId);
  // const filterStatus =
  //   filterStatusGroup[
  //     userViews.find((view) => view.id == viewId) ? viewId : "suggestViews"
  //   ];

  switch (action.type) {
    case "reverseNameFilter": {
      const id = isUserViewGroup ? viewId : "firstSuggestView";
      return {
        ...state,
        viewHint: id,
        filterStatusGroup: generateFilterStatusGroup(
          id,
          new FilterStatus(filterStatus, {
            type: "name",
            status: Object.fromEntries(
              Array.from(Film.names).map((filmName) => [
                filmName,
                !filterStatus.name[filmName],
              ]),
            ),
          }),
        ),
      };
    }

    case "changeView": {
      const nextId = action.nextView.id;
      return {
        ...state,
        viewHint: nextId,
        filterStatusGroup: action.nextView.belongUserViewGroup
          ? generateFilterStatusGroup(nextId, filterStatusGroup[nextId])
          : filterStatusGroup,
      };
    }

    case "localize": {
      const userViews = action.localConstructor.userViews?.map(
        (construtor) =>
          new View(construtor.joiningIds, undefined, undefined, construtor.id),
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
        filterStatusGroup: generateFilterStatusGroup(id, statusGroup[id]),
        viewHint: id,
      };
    }

    case "changeFilmInput": {
      const newUserView = new View(action.view.joiningIds, action.viewConfig);

      return {
        ...state,
        viewHint: newUserView.id,
        userViews: userViews.toSpliced(
          isUserViewGroup
            ? userViews.findIndex((v) => v.id == viewId)
            : userViews.length,
          1,
          newUserView,
        ),
        filterStatusGroup: generateFilterStatusGroup(
          newUserView.id,
          filterStatus,
        ),
      };
    }

    case "removeView": {
      const removedViewId = action.removedView.id;
      const getSiblingView = (offset: number) =>
        action.views.find(
          (_, i, views) => views[i - offset]?.id == removedViewId,
        );
      const nextView =
        removedViewId == action.currentView.id
          ? getSiblingView(1) ?? getSiblingView(-1)!
          : action.currentView;
      const nextId = nextView.id;

      return {
        ...state,
        viewHint: nextId,
        userViews: userViews.filter((v) => v.id != action.removedView.id),
        filterStatusGroup: nextView.belongUserViewGroup
          ? generateFilterStatusGroup(nextId, filterStatusGroup[nextId])
          : filterStatusGroup,
      };
    }

    case "changeFilter": {
      const nextFilterStatus = new FilterStatus(
        filterStatus,
        action.checkConfig,
      );
      const id = isUserViewGroup ? viewId : "firstSuggestView";

      return {
        // removedIdSets: removedIdSets,
        ...state,
        filterStatusGroup: generateFilterStatusGroup(id, nextFilterStatus),
        viewHint: id,
      };
    }

    case "clearNameFilter": {
      // const nextSets = { ...removedIdSets };
      // delete nextSets[action.viewGroupId];
      const id = isUserViewGroup ? viewId : "fallback";
      return {
        // removedIdSets: removedIdSets,
        ...state,
        viewHint: id,
        filterStatusGroup: generateFilterStatusGroup(
          id,
          new FilterStatus(filterStatus, { type: "name", status: {} }),
        ),
      };
    }
  }

  function generateFilterStatusGroup(
    viewId: View["id"],
    status: FilterStatus,
  ): ViewState["filterStatusGroup"] {
    return {
      ...filterStatusGroup,
      [viewId]: status,
      suggestViews: status,
    };
  }
}
