import Check from "./check";
import View from "./view";
import { CheckConfig } from "./definitions";
import ViewGroup from "./viewGroup";
import { useReducer } from "react";
import { getLocalConfig, setLocalConfig } from "./useLocalStorage";

export default function useViewGroupReducer(initialViewId: string) {
  const [validViewGroup, dispatch] = useReducer(validViewGroupReducer, {
    check: new Check(getLocalConfig().check),
    viewId: initialViewId,
    // removedIdSets: { [View.userViewId]: new Set() },
  });

  return [
    validViewGroup,
    (action: Action) => {
      setLocalConfig(
        "check",
        validViewGroupReducer(validViewGroup, action).check,
      );
      dispatch(action);
    },
  ] as [ValidViewGroup, (action: Action) => void];
}

interface ValidViewGroup {
  check: Check;
  viewId: string;
  // removedIdSets: {
  //   [k: ViewGroup["id"]]: Set<View["id"]>;
  // };
}

type Action =
  | {
      type: "clearNameFilter";
      nextViewId: View["id"];
    }
  | {
      type: "updateCheck";
      checkConfig: CheckConfig;
      isUserViewGroup: boolean;
      nextViewId: View["id"];
    }
  // | {
  //     type: "removeView";
  //     // targView: View;
  //     nextViewId: string;
  //   }
  | { type: "changeView"; viewId: string };

function validViewGroupReducer(
  state: ValidViewGroup,
  action: Action,
): ValidViewGroup {
  const { viewId, check } = state;
  console.info(state, action);
  switch (action.type) {
    case "changeView": {
      return {
        ...state,
        viewId: action.viewId,
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

    case "updateCheck": {
      const nextCheck = new Check(check, action.checkConfig);
      // const nextViewRemoved = structuredClone(viewRemoved);
      // nextViewRemoved[1] = {};

      return {
        // removedIdSets: removedIdSets,
        check: nextCheck,
        viewId: action.nextViewId,
      };
    }

    case "clearNameFilter": {
      // const nextSets = { ...removedIdSets };
      // delete nextSets[action.viewGroupId];

      return {
        // removedIdSets: removedIdSets,
        check: new Check({ ...check, name: {} }),
        viewId: action.nextViewId,
      };
    }
  }
}
