import Film from "../app/Film";
import Filter from "../app/Filter";
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
          <span className={`whitespace-nowrap`}>{name}</span>
        </label>
      ))}
    </fieldset>
  );
}

// export function getValidViews(filter: Filter) {
//   const group: { [indexed: string]: Film[] } = {};
//   const validFilms = filter.validFilms;
//   if (!validFilms.length) return [];

//   validFilms.forEach((film) => {
//     if (film.name in group) {
//       group[film.name].push(film);
//     } else {
//       group[film.name] = [film];
//     }
//   });

//   const result: View[] = [];
//   const groups = Object.values(group);
//   const indexes: number[] = new Array(groups.length).fill(0);

//   let k = 0;
//   for (let i = 0; ; k++) {
//     // console.log(indexes);
//     const curFilm = groups[i][indexes[i]];
//     const isOverlapping = indexes
//       .slice(0, i)
//       .map((index, j) => groups[j][index])
//       .some((film) => areIntervalsOverlapping(curFilm.time, film.time));

//     if (!isOverlapping) {
//       if (i < groups.length - 1) {
//         i++;
//         continue;
//       }

//       result.push(
//         new View(
//           groups.flat(),
//           indexes.map((i, j) => groups[j][i].id)
//         )
//       );
//     }

//     if (indexes[i] < groups[i].length - 1) {
//       indexes[i]++;
//       continue;
//     }

//     while (indexes[i] >= groups[i].length - 1) {
//       if (i == 0 || k++ >= 9999) {
//         // console.log(k);
//         return result;
//       }

//       indexes[i--] = 0;
//     }
//     indexes[i]++;
//   }
// }
