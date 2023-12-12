import { FilmPropKey } from "@/lib/definitions";
import Film from "../../lib/film";
import View from "../../lib/view";
import FilmInput from "./Input";
import { FilmConfig } from "@/lib/definitions";

interface TableProp {
  view: View;
  filteredFilms: Film[];
  handleChange: (this: Film, k: FilmConfig) => void;
}

export default function Table({
  view,
  filteredFilms,
  handleChange,
}: TableProp) {
  const titles: FilmPropKey[] = ["name", "date", "start", "end", "join"];
  const rows = filteredFilms.map((film) => {
    return (
      <li key={film.id} data-id={film.id}>
        <ul className="row grid">
          {titles.map((title) => (
            <li key={title} className="cell">
              <label>
                <FilmInput
                  prop={title}
                  value={title == "join" ? undefined : film[title]}
                  checked={view.getJoinStatus(film)}
                  // view={view}
                  handleChange={handleChange.bind(film)}
                />
              </label>
            </li>
          ))}
        </ul>
      </li>
    );
  });

  return (
    <form>
      <ul className="info table">
        <li className="row">
          <ul className="row grid text-center">
            {titles.map((title) => (
              <li key={title}>{title[0].toUpperCase() + title.slice(1)}</li>
            ))}
          </ul>
        </li>
        {rows}
      </ul>
    </form>
  );
}
