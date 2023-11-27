"use client";

import Check from "./check";
import View from "./view";
import { CheckConfig } from "./definitions";
import ViewGroup from "./viewGroup";
import { useReducer } from "react";
import { getLocalConfig, setLocalConfig } from "./useLocalStorage";
import localforage from "localforage";

export default function useViewReducer() {
  localforage
    .getItem("key")
    .then(function (value) {
      console.log(value);
    })
    .catch(function (err) {
      console.error(err);
    });
  const [state, dispatch] = useReducer(reducer, null, () => {
    const localUserViews = getLocalConfig().userViewConstructors?.map(
      (construtor) => new View(construtor.joinIds),
    ) ?? [new View()];

    return {
      check: new Check(getLocalConfig().checkConstructor),
      viewId: localUserViews[0].id,
      userViews: localUserViews,
      // removedIdSets: { [View.userViewId]: new Set() },
    } satisfies ReturnType<typeof reducer>;
  });

  return [
    state,
    (action: Action) => {
      const nextState = reducer(state, action);

      setLocalConfig("check", nextState.check);
      setLocalConfig("userViews", nextState.userViews);
      console.log(nextState.userViews);

      dispatch(action);
    },
  ] as const;
}

interface ViewState {
  check: Check;
  viewId: string;
  userViews: View[];
  // removedIdSets: {
  //   [k: ViewGroup["id"]]: Set<View["id"]>;
  // };
}

type Action =
  | { type: "updateUserViews"; newView: View }
  | {
      type: "clearNameFilter";
      // nextViewId: View["id"];
    }
  | {
      type: "updateCheck";
      checkConfig: CheckConfig;
      // isUserViewGroup: boolean;
      // nextViewId: View["id"];
    }
  // | {
  //     type: "removeView";
  //     // targView: View;
  //     nextViewId: string;
  //   }
  | { type: "changeView"; nextView: View };

function reducer(state: ViewState, action: Action): ViewState {
  const { viewId, check, userViews } = state;
  const isUserViewGroup = !!userViews.find((v) => v.id == viewId);

  // console.info(state, action);

  switch (action.type) {
    case "updateUserViews": {
      return {
        ...state,
        userViews: isUserViewGroup
          ? userViews.toSpliced(
              userViews.findIndex((v) => v.id == viewId),
              1,
              action.newView,
            )
          : [...userViews, action.newView],
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
      const firstValidView = nextCheck.getValidViews()[0];
      // const nextViewRemoved = structuredClone(viewRemoved);
      // nextViewRemoved[1] = {};

      return {
        // removedIdSets: removedIdSets,
        check: nextCheck,
        viewId: isUserViewGroup || !firstValidView ? viewId : firstValidView.id,
        userViews: userViews,
      };
    }

    case "clearNameFilter": {
      // const nextSets = { ...removedIdSets };
      // delete nextSets[action.viewGroupId];

      return {
        // removedIdSets: removedIdSets,
        check: new Check({ ...check, name: {} }),
        viewId: isUserViewGroup ? viewId : userViews[0].id,
        userViews: userViews,
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
