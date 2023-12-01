"use client";

import { useReducer } from "react";
import Check from "./check";
import { CheckConfig, LocalConfig, ViewState } from "./definitions";
import { setLocalConfig } from "./localforage";
import View from "./view";
import Film from "./film";

export default function useViewReducer() {
  const [state, dispatch] = useReducer(reducer, null, () => {
    const userViews = [new View()];
    return {
      check: new Check(),
      viewId: userViews[0].id,
      userViews: userViews,
    } satisfies ReturnType<typeof reducer>;
  });

  return [state, dispatch] as const;
}

type Action =
  | { type: "reverseNameCheck" }
  | { type: "localize"; localConfig: LocalConfig }
  | { type: "updateUserViews"; newView: View }
  | {
      type: "clearNameCheck";
    }
  | {
      type: "updateCheck";
      checkConfig: CheckConfig;
    }
  | {
      type: "removeView";
      removedView: View;
    }
  | { type: "changeView"; nextView: View };

function reducer(state: ViewState, action: Action): ViewState {
  const { viewId, check, userViews } = state;
  const isUserViewGroup = !!userViews.find((v) => v.id == viewId);
  // console.time('reducer')

  switch (action.type) {
    case "reverseNameCheck": {
      return {
        ...state,
        check: new Check({
          ...check,
          name: Object.fromEntries(
            Array.from(Film.names).map((name) => [name, !check.name[name]]),
          ),
        }),
      };
    }

    case "localize": {
      const userViews = action.localConfig.userViewConstructors.map(
        (construtor) => new View(construtor.joiningIds),
      ) ?? [new View()];

      return {
        check: new Check(action.localConfig.checkConstructor),
        viewId: userViews[0].id,
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
      };
    }

    case "removeView": {
      const removedView = action.removedView;

      View.remove(removedView);
      return {
        ...state,
        userViews: userViews.filter((v) => !v.removed),
      };
    }

    case "changeView": {
      return {
        ...state,
        viewId: action.nextView.id,
      };
    }

    case "updateCheck": {
      const nextCheck = new Check(check, action.checkConfig);
      const firstValidView = nextCheck.getShownValidViews()[0];
      // const nextViewRemoved = structuredClone(viewRemoved);
      // nextViewRemoved[1] = {};
      return {
        // removedIdSets: removedIdSets,
        ...state,
        check: nextCheck,
        viewId: isUserViewGroup || !firstValidView ? viewId : firstValidView.id,
      };
    }

    case "clearNameCheck": {
      // const nextSets = { ...removedIdSets };
      // delete nextSets[action.viewGroupId];
      return {
        // removedIdSets: removedIdSets,
        ...state,
        check: new Check({ ...check, name: {} }),
        viewId: isUserViewGroup ? viewId : userViews[0].id,
      };
    }

    // case "removeView": {
    //   // const nextViewRemoved = structuredClone(viewRemoved);
    //   // const { groupId, id } = action.targView;
    //   // nextViewRemoved[groupId][id] = true;
    //   return {
    //     ...state,
    //     // viewRemoved: nextViewRemoved,
    //     viewId: action.nextViewId,
    //   };
    // }
  }
}
