import { Fragment, MouseEventHandler } from "react";
import View, { ViewGroup } from "../app/View";
import clsx from "clsx";

interface Nav {
  handleViewRemove: (this: ViewGroup, targView: View) => void;
  handleViewChange: (id: string) => void;
  viewGroups: ViewGroup[];
  curViewId: View["id"];
}

export default function ViewNav({
  handleViewRemove,
  handleViewChange,
  viewGroups,
  curViewId,
}: Nav) {
  return (
    <nav className="flex w-full overflow-x-auto pb-2">
      {viewGroups.map((viewGroup) => (
        <Fragment key={viewGroup.title}>
          <h3 className="whitespace-pre leading-none">{viewGroup.title}</h3>
          <fieldset
            name={viewGroup.id}
            className="flex items-stretch divide-x py-1"
          >
            {viewGroup.views.length ? (
              viewGroup.views.map((view, j) => (
                <ViewRadio
                  key={view.id}
                  handleViewRemove={handleViewRemove}
                  handleViewChange={handleViewChange}
                  curViewId={curViewId}
                  viewGroup={viewGroup}
                  index={j}
                />
              ))
            ) : (
              <span className="ml-2">（無）</span>
            )}
          </fieldset>
        </Fragment>
      ))}
    </nav>
  );
}

interface ViewRadio {
  viewGroup: ViewGroup;
  index: number;
}

function ViewRadio({
  handleViewRemove,
  handleViewChange,
  curViewId,
  viewGroup,
  index,
}: Omit<Nav, "viewGroups"> & ViewRadio) {
  const view = viewGroup.views[index];
  const isFirstRadio = viewGroup.id == "0" && index == 0;
  return (
    <fieldset className="group relative grid items-stretch">
      <button
        onClick={handleViewRemove.bind(viewGroup, view)}
        className={clsx(
          "absolute right-1 hidden w-4",
          !isFirstRadio && "group-hover:block",
        )}
      >
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
      </button>
      <label className="grid w-14 cursor-pointer place-items-center text-center leading-none hover:text-gray-400 [&:has(:checked)]:cursor-default [&:has(:checked)]:font-bold [&:has(:checked)]:text-blue-300">
        <span>{index}</span>
        <input
          type="radio"
          name="view"
          checked={view.id == curViewId}
          className="hidden"
          onChange={() => handleViewChange(view.id)}
        />
      </label>
    </fieldset>
  );
}

export function useViewGroup(name: string) {}
