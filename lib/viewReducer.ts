"use client";

import { useReducer } from "react";
import CheckStatus from "./check";
import { CheckConfig, LocalConstructor } from "./definitions";
import View from "./view";
import Film from "./film";

export default function useViewReducer() {
  return useReducer(reducer, null, getInitialState);
}

type ViewState = {
  checkStatusGroup: {
    [k: View["id"]]: CheckStatus;
    suggestViews: CheckStatus;
  };
  viewId: View["id"];
  userViews: View[];
};
export function getInitialState(): ViewState {
  const userViews = [new View(), new View()];
  const id = userViews[0].id;
  const status = new CheckStatus();

  return {
    checkStatusGroup: {
      [id]: status,
      [userViews[1].id]: status,
      suggestViews: status,
    },
    viewId: id,
    userViews: userViews,
  };
}

type Action =
  | { type: "reverseNameCheck" }
  | { type: "localize"; localConstructor: LocalConstructor }
  | { type: "updateUserViews"; newView: View }
  | {
      type: "clearNameCheck";
    }
  | {
      type: "updateCheck";
      checkConfig: CheckConfig;
    }
  | {
      type: "removeUserView";
      removedView: View;
    }
  | { type: "changeView"; nextView: View };

function reducer(state: ViewState, action: Action): ViewState {
  const { viewId, checkStatusGroup, userViews } = state;
  const isUserViewGroup = !!userViews.find((v) => v.id == viewId);
  const checkStatus =
    checkStatusGroup[
      userViews.find((view) => view.id == viewId) ? viewId : "suggestViews"
    ];

  switch (action.type) {
    case "reverseNameCheck": {
      const id = isUserViewGroup ? viewId : "firstSuggestView";
      return {
        ...state,
        viewId: id,
        checkStatusGroup: generateCheckStatusGroup(
          id,
          new CheckStatus(checkStatus, {
            type: "name",
            status: Object.fromEntries(
              Array.from(Film.names).map((filmName) => [
                filmName,
                !checkStatus.name[filmName],
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
        viewId: nextId,
        checkStatusGroup: action.nextView.belongUserViewGroup
          ? generateCheckStatusGroup(nextId, checkStatusGroup[nextId])
          : checkStatusGroup,
      };
    }

    case "localize": {
      const userViews = action.localConstructor.userViews?.map(
        (construtor) =>
          new View(construtor.joiningIds, undefined, undefined, construtor.id),
      );
      const localStatus = action.localConstructor.checkStatusGroup;
      const statusGroup = Object.fromEntries(
        Object.entries(localStatus).map(([id, constructor]) => [
          id,
          new CheckStatus(constructor),
        ]),
      );
      const id = userViews[0].id;

      return {
        checkStatusGroup: generateCheckStatusGroup(id, statusGroup[id]),
        viewId: id,
        userViews: userViews,
      };
    }

    case "updateUserViews": {
      return {
        ...state,
        userViews: userViews.toSpliced(
          isUserViewGroup
            ? userViews.findIndex((v) => v.id == viewId)
            : userViews.length,
          1,
          action.newView,
        ),
        checkStatusGroup: generateCheckStatusGroup(
          action.newView.id,
          checkStatus,
        ),
      };
    }

    case "removeUserView": {
      return {
        ...state,
        userViews: userViews.filter((v) => v.id != action.removedView.id),
      };
    }

    case "updateCheck": {
      const nextCheckStatus = new CheckStatus(checkStatus, action.checkConfig);
      const id = isUserViewGroup ? viewId : "firstSuggestView";

      return {
        // removedIdSets: removedIdSets,
        ...state,
        checkStatusGroup: generateCheckStatusGroup(id, nextCheckStatus),
        viewId: id,
      };
    }

    case "clearNameCheck": {
      // const nextSets = { ...removedIdSets };
      // delete nextSets[action.viewGroupId];
      const id = isUserViewGroup ? viewId : "fallback";
      return {
        // removedIdSets: removedIdSets,
        ...state,
        viewId: id,
        checkStatusGroup: generateCheckStatusGroup(
          id,
          new CheckStatus(checkStatus, { type: "name", status: {} }),
        ),
      };
    }
  }

  function generateCheckStatusGroup(
    viewId: View["id"],
    status: CheckStatus,
  ): ViewState["checkStatusGroup"] {
    return {
      ...checkStatusGroup,
      [viewId]: status,
      suggestViews: status,
    };
  }
}
