import { Fragment } from "react";
import View from "../../lib/view";
import clsx from "clsx";
import ViewGroup from "@/lib/viewGroup";
import { ViewInfo } from "@/lib/definitions";

interface Nav {
  handleViewChange: (k: View["id"]) => void;
  handleViewRemove: (k: View) => void;
  viewGroups: View[][];
  curViewId: View["id"];
}

export default function ViewNav({
  handleViewChange,
  handleViewRemove,
  viewGroups,
  curViewId,
}: Nav) {
  const titles = ["自\n訂", "生\n成"];
  return (
    <nav className="flex overflow-x-auto py-2">
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
                viewGroup.map((view, j) => (
                  <ViewSwitch
                    key={view.id}
                    handleViewChange={() => handleViewChange(view.id)}
                    handleViewRemove={() => handleViewRemove(view)}
                    isChecked={view.id == curViewId}
                    isFirst={i == 0 && j == 0}
                    label={j}
                  />
                ))
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
  isFirst: boolean;
  label: number;
  handleViewChange: () => void;
  handleViewRemove: () => void;
  isChecked: boolean;
}

function ViewSwitch({
  isFirst,
  label,
  handleViewChange,
  handleViewRemove,
  isChecked,
}: ViewSwitch) {
  return (
    <fieldset className="group relative grid items-stretch">
      <button
        onClick={handleViewRemove}
        className={clsx(
          "absolute right-1 hidden w-4",
          !isFirst && "group-hover:block",
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
        <span>{label}</span>
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
