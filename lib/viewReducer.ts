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
    viewRemoved: { 0: {}, 1: {} },
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
  viewRemoved: {
    [k: ViewGroup["id"]]: {
      [k: View["id"]]: boolean;
    };
  };
  viewId: string;
}

type Action =
  | {
      type: "clearNameFilter";
      viewGroupId: ViewGroup["id"];
      fallbackViewId: View["id"];
    }
  | {
      type: "updateCheck";
      checkConfig: CheckConfig;
      viewGroupId: ViewGroup["id"];
      fallbackViewId: View["id"];
    }
  | {
      type: "removeView";
      targViewGroupId: ViewGroup["id"];
      targViewId: string;
      nextViewId: string;
    }
  | { type: "changeView"; viewId: string };

function validViewGroupReducer(
  state: ValidViewGroup,
  action: Action,
): ValidViewGroup {
  const { viewId, check, viewRemoved } = state;
  console.info(state, action);
  switch (action.type) {
    case "changeView": {
      return {
        ...state,
        viewId: action.viewId,
      };
    }

    case "removeView": {
      const nextViewRemoved = structuredClone(viewRemoved);
      nextViewRemoved[action.targViewGroupId][action.targViewId] = true;

      return {
        check: check,
        viewRemoved: nextViewRemoved,
        viewId: action.nextViewId,
      };
    }

    case "updateCheck": {
      const nextCheck = new Check(check, action.checkConfig);
      const nextViewRemoved = structuredClone(viewRemoved);
      nextViewRemoved[1] = {};

      return {
        check: nextCheck,
        viewRemoved: nextViewRemoved,
        viewId:
          action.viewGroupId == 0
            ? viewId
            : nextCheck.getValidViews()[0].id ?? action.fallbackViewId,
      };
    }

    case "clearNameFilter": {
      return {
        check: new Check({ ...check, name: {} }),
        viewRemoved: { ...viewRemoved, 1: {} },
        viewId: action.viewGroupId == 1 ? action.fallbackViewId : viewId,
      };
    }
  }
}
