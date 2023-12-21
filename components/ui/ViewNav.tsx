import View from "../../lib/view";
import clsx from "clsx";
import { Icons } from "../icons";
import { Button } from "./button";
import { Carousel } from "./Carousel";

interface Nav {
  viewGroups: (View[] | null)[];
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
  const configs = [
    {
      title: "自\n訂",
      style: "flex",
      component: UserGroup,
    },
    {
      title: "生\n成",
      style: "grid grid-flow-col items-center",
      component: SuggestGroup,
    },
  ];

  return (
    <nav className="grid grid-flow-col grid-cols-[auto_1fr] justify-items-start pb-2 pt-1">
      {viewGroups.map((views, i) => {
        const config = configs[i];
        return (
          <div key={config.title} className={config.style}>
            <span className="whitespace-pre leading-none">{config.title}</span>
            <config.component {...{ views, curViewId, userViewId, handlers }} />
          </div>
        );
      })}
    </nav>
  );
}

interface Group {
  views: View[] | null;
  curViewId: string;
  userViewId?: string;
  handlers: {
    [k: string]: (view: View) => void;
  };
}

function UserGroup({ views, curViewId, userViewId, handlers }: Group) {
  return (
    <fieldset className="grid grid-flow-col divide-x py-1">
      {views?.map((view, j) => (
        <ViewSwitch
          key={view.id}
          label={j}
          checked={view.id == curViewId}
          showRemove={j != 0}
          isCurrentUserView={view.id == userViewId}
          handlers={Object.fromEntries(
            Object.entries(handlers).map(([key, handler]) => [
              key,
              () => handler(view),
            ]),
          )}
        />
      ))}
      <Button
        key={"plus"}
        variant={"icon"}
        size={"icon"}
        onClick={handlers.copy as () => void}
        className={"w-14"}
      >
        <Icons.plus />
      </Button>
    </fieldset>
  );
}

function SuggestGroup({ views, curViewId, handlers }: Group) {
  if (!views) return <span className="ml-2">（無）</span>;

  return (
    <Carousel key={views[0].id}>
      <>
        {views.map((view, j) => (
          <ViewSwitch
            key={view.id}
            label={j}
            checked={view.id == curViewId}
            showRemove={false}
            isCurrentUserView={false}
            handlers={Object.fromEntries(
              Object.entries(handlers).map(([key, handler]) => [
                key,
                () => handler(view),
              ]),
            )}
          />
        ))}
      </>
    </Carousel>
  );
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
    <fieldset className="group relative grid w-14">
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
          "grid w-full place-content-center font-bold",
          isCurrentUserView || checked || "font-normal text-gray-400",
          checked ||
            "cursor-pointer hover:text-stone-900 dark:hover:text-neutral-200",
          checked && "text-blue-500 dark:text-blue-300",
        )}
      >
        <span>{label}</span>
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
