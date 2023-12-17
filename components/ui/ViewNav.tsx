import { Fragment } from "react";
import View from "../../lib/view";
import clsx from "clsx";
import { Icons } from "../icons";

interface Nav {
  handleViewChange: (k: View) => void;
  handleViewRemove: (k: View) => void;
  viewGroups: View[][];
  userViewId: View["id"];
  viewId: View["id"];
}

export default function ViewNav({
  handleViewChange,
  handleViewRemove,
  viewGroups,
  userViewId,
  viewId: curViewId,
}: Nav) {
  const titles = ["自\n訂", "生\n成"];
  return (
    <nav className="flex overflow-x-scroll py-4">
      {viewGroups.map((viewGroup, i) => {
        const title = titles[i];
        return (
          <Fragment key={title}>
            <h3 className="whitespace-pre leading-none">{title}</h3>
            <fieldset
              // name={title}
              className="flex items-stretch divide-x py-1"
            >
              {viewGroup.length ? (
                viewGroup.map((view, j) => {
                  const isChecked = view.id == curViewId;
                  return (
                    <ViewSwitch
                      key={view.id}
                      label={j}
                      handleViewChange={() => handleViewChange(view)}
                      handleViewRemove={() => handleViewRemove(view)}
                      isChecked={isChecked}
                      showRemove={i == 0 && j != 0}
                      isCurrentUserView={i == 0 && view.id == userViewId}
                    />
                  );
                })
              ) : (
                <span className="ml-2">（無）</span>
              )}
            </fieldset>
          </Fragment>
        );
      })}
    </nav>
  );
}

interface ViewSwitch {
  label: number;
  handleViewChange: () => void;
  handleViewRemove: () => void;
  isChecked: boolean;
  showRemove: boolean;
  isCurrentUserView: boolean;
}

function ViewSwitch({
  label,
  handleViewChange,
  handleViewRemove,
  isChecked,
  showRemove,
  isCurrentUserView,
}: ViewSwitch) {
  return (
    <fieldset className="group relative grid items-stretch px-2">
      <button
        onClick={handleViewRemove}
        className={clsx(
          "absolute right-1 hidden w-4",
          showRemove && "group-hover:block",
        )}
      >
        <Icons.cross />
      </button>
      <label
        className={clsx(
          "grid w-10 place-items-center",
          isCurrentUserView || "text-gray-400",
          isCurrentUserView && !isChecked && "font-semibold",
          isChecked || "cursor-pointer hover:opacity-50",
          isChecked && "font-bold text-blue-500 dark:text-blue-300",
        )}
      >
        <span className={"w-full text-center"}>{label}</span>
        <input
          type="radio"
          name="view"
          checked={isChecked}
          className="hidden"
          onChange={handleViewChange}
        />
      </label>
    </fieldset>
  );
}

export function useViewGroup(name: string) {}
