import clsx from "clsx";
import Film from "../../lib/film";
import FilterStatus from "../../lib/filterStatus";
import { CheckConfig } from "@/lib/definitions";

interface NameFilter {
  check: FilterStatus;
  handleChange: (k: CheckConfig) => void;
}

export default function NameFilter({ check, handleChange }: NameFilter) {
  return (
    <fieldset className="flex flex-wrap gap-x-2">
      {Array.from(Film.names).map((name) => {
        const isCheck = !!check.name[name];
        return (
          <label
            key={name}
            className={`flex cursor-pointer gap-1 hover:text-gray-500 dark:hover:text-gray-300 ${
              isCheck ? "font-semibold" : "text-gray-400"
            }`}
          >
            <input
              type="checkbox"
              name={"name"}
              defaultValue={name}
              checked={isCheck}
              className="cursor-pointer"
              onChange={(e) =>
                handleChange({
                  type: "name",
                  filmNameOrMonthDate: name,
                  checked: e.target.checked,
                })
              }
            />
            <span
              className={clsx(
                "whitespace-nowrap",
                Film.getSoldoutStatus(name) &&
                  "text-gray-400 line-through decoration-4",
              )}
            >
              {name}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
