import View from "../../lib/view";
import clsx from "clsx";
import { Icons } from "../icons";
import { Button } from "./button";

interface Nav {
  viewGroups: View[][];
  userViewId: View["id"];
  viewId: View["id"];
  handlers: { [k: string]: (view: View) => void };
}

export default function ViewNav({
  handlers,
  viewGroups,
  userViewId,
  viewId: curViewId,
}: Nav) {
  const titles = ["自\n訂", "生\n成"];
  return (
    <nav className="flex overflow-x-scroll py-4">
      {viewGroups.map((views, i) => {
        const title = titles[i];
        const isUserGroup = i == 0;
        return (
          <div key={title} className="flex">
            <span className="whitespace-pre leading-none">{title}</span>
            <fieldset className="grid grid-flow-col divide-x py-1">
              {views.length ? (
                ViewGroup({
                  views,
                  curViewId,
                  userViewId,
                  handlers,
                  isUserGroup,
                })
              ) : (
                <span className="ml-2">（無）</span>
              )}
            </fieldset>
          </div>
        );
      })}
    </nav>
  );
}

interface ViewGroup {
  views: View[];
  curViewId: string;
  isUserGroup: boolean;
  userViewId: string;
  handlers: {
    [k: string]: (view: View) => void;
  };
}

function ViewGroup({
  views,
  curViewId,
  isUserGroup,
  userViewId,
  handlers,
}: ViewGroup) {
  const group = views.map((view, j) => {
    return (
      <ViewSwitch
        key={view.id}
        label={j}
        checked={view.id == curViewId}
        showRemove={isUserGroup && j != 0}
        isCurrentUserView={view.id == userViewId}
        handlers={Object.fromEntries(
          Object.entries(handlers).map(([key, handler]) => [
            key,
            () => handler(view),
          ]),
        )}
      />
    );
  });

  if (isUserGroup) {
    group.push(
      <Button
        variant={"icon"}
        size={"icon"}
        onClick={handlers.copy as () => void}
        className={"w-14"}
      >
        <Icons.plus />
      </Button>,
    );
  }

  return group;
}

interface ViewSwitch {
  label: number;
  checked: boolean;
  showRemove: boolean;
  isCurrentUserView: boolean;
  handlers: { [k: string]: () => void };
}

function ViewSwitch({
  label,
  handlers,
  checked,
  showRemove,
  isCurrentUserView,
}: ViewSwitch) {
  return (
    <fieldset className="group relative grid w-14 place-items-center">
      {showRemove && (
        <Button
          variant={"icon"}
          size={"icon"}
          onClick={handlers.remove}
          className={clsx(
            "absolute right-1 top-0 hidden w-4 group-hover:block",
          )}
        >
          <Icons.cross />
        </Button>
      )}
      <label
        className={clsx(
          "w-max font-bold",
          isCurrentUserView || checked || "font-normal text-gray-400",
          checked ||
            "cursor-pointer hover:text-stone-900 dark:hover:text-neutral-200",
          checked && "text-blue-500 dark:text-blue-300",
        )}
      >
        <span className={"w-full text-center"}>{label}</span>
        <input
          type="radio"
          name="view"
          checked={checked}
          className="hidden"
          onChange={handlers.change}
        />
      </label>
    </fieldset>
  );
}
