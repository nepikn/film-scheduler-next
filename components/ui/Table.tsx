import Film from "../../lib/Film";
import Filter from "../../lib/Filter";
import View from "../../lib/View";
import Input, { TableInput } from "./Input";

export type TableTitle = "name" | "date" | "start" | "end" | "join";
interface TableProp {
  view: View;
  filter: Filter;
  handleChange: (this: Film, input: TableInput) => void;
}

export default function Table({ view, filter, handleChange }: TableProp) {
  const titles: TableTitle[] = ["name", "date", "start", "end", "join"];
  // console.log("table");

  const rows = filter.validFilms.map((film) => {
    return (
      <li key={film.id} data-id={film.id}>
        <ul className="row grid">
          {titles.map((title) => (
            <li key={title} className="cell">
              <label>
                <Input
                  name={title}
                  // val={title == "join" ? view.getChecked(film) : film[title]}
                  film={film}
                  view={view}
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
