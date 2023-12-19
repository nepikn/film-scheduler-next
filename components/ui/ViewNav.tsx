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
  const configs = [
    {
      title: "自\n訂",
      style: "flex",
      component: UserGroup,
    },
    {
      title: "生\n成",
      style: "grid grid-flow-col grid-cols-[auto_auto_1fr_auto]",
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
  views: View[];
  curViewId: string;
  userViewId?: string;
  handlers: {
    [k: string]: (view: View) => void;
  };
}

function UserGroup({ views, curViewId, userViewId, handlers }: Group) {
  return (
    <fieldset className="grid grid-flow-col divide-x py-1">
      {views.map((view, j) => (
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
  return (
    <>
      <Button
        variant={"icon"}
        size={"icon"}
        onClick={handlers.copy as () => void}
        className={"w-8 justify-end"}
      >
        <Icons.left />
      </Button>
      <div className="grid items-center overflow-x-hidden">
        <fieldset className="flex flex-shrink-0 divide-x py-1">
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
        </fieldset>
      </div>
      <Button
        variant={"icon"}
        size={"icon"}
        onClick={handlers.copy as () => void}
        className={"w-8 justify-start"}
      >
        <Icons.right />
      </Button>
    </>
  );
}

// function Views({ views, curViewId, isUserGroup, userViewId, handlers }: Views) {
//   const elems = views.length ? (
//     views.map((view, j) => (
//       <ViewSwitch
//         key={view.id}
//         label={j}
//         checked={view.id == curViewId}
//         showRemove={isUserGroup && j != 0}
//         isCurrentUserView={view.id == userViewId}
//         handlers={Object.fromEntries(
//           Object.entries(handlers).map(([key, handler]) => [
//             key,
//             () => handler(view),
//           ]),
//         )}
//       />
//     ))
//   ) : (
//     <span className="ml-2">（無）</span>
//   );

//   if (Array.isArray(elems) && isUserGroup) {
//     elems.push(
//       <Button
//         key={"plus"}
//         variant={"icon"}
//         size={"icon"}
//         onClick={handlers.copy as () => void}
//         className={"w-14"}
//       >
//         <Icons.plus />
//       </Button>,
//     );
//   } else {
//     // group.unshift(
//     // );
//   }

//   return (
//     <fieldset className="inline-grid grid-flow-col divide-x py-1">
//       {elems}
//     </fieldset>
//   );
// }

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
          "grid w-full place-items-center font-bold",
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
