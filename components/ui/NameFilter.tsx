import clsx from "clsx";
import Film from "../../lib/film";
import Filter from "../../lib/filter";
import { FilterCheckbox } from "./Input";

interface NameFilter {
  filter: Filter;
  handleChange: (input: FilterCheckbox) => void;
}

export default function NameFilter({ filter, handleChange }: NameFilter) {
  return (
    <fieldset className="flex flex-wrap gap-x-2">
      {Array.from(Film.nameSet).map((name) => (
        <label
          key={name}
          className={`flex cursor-pointer gap-1 hover:text-gray-500 dark:hover:text-gray-300 ${
            filter.name[name] ? "font-semibold" : "text-gray-400"
          }`}
        >
          <input
            type="checkbox"
            name={"name"}
            defaultValue={name}
            defaultChecked={filter.name[name]}
            className="cursor-pointer"
            onChange={(e) => handleChange(e.target as FilterCheckbox)}
          />
          <span
            className={clsx(
              "whitespace-nowrap",
              Film.isSoldout(name) && "text-gray-400 line-through decoration-4",
            )}
          >
            {name}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
