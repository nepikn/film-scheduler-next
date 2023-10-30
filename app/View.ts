import { v4, v5 } from "uuid";
import Film from "./Film";
import { TableInput } from "../components/Input";

// interface FilmName {
//   [Id: Film["id"]]: Film["name"] | null;
// }
interface Join {
  [Name: Film["name"]]: Film["id"] | null;
}

export default class View {
  id;
  join: Join = {};

  constructor(join: Join = {}, input?: TableInput, film?: Film) {
    this.id = v4();
    this.join = { ...join };
    // v5(Object.values(join).join("-"), "f3f50456-bb04-4abf-935c-c90de999cf4a");
    // this.films = films;
    if (input && film) {
      this.handleChange(input, film);
    }
  }

  handleChange(input: TableInput, film: Film) {
    if (
      input.name == "name" &&
      input.value != film.name &&
      this.join[film.name] == film.id
    ) {
      this.join[film.name] = null;
    }

    if (input.name == "join") {
      this.join[film.name] = input.checked ? film.id : null;
    } else {
      film[input.name] = input.value;
    }
  }

  getSkipped(film: Film): boolean {
    const sameNameCheckedId = this.join[film.name];
    return !!sameNameCheckedId && film.id != sameNameCheckedId;
  }

  getJoin(film: Film) {
    return "" + this.getChecked(film);
  }
  getChecked(film: Film) {
    return film.id == this.join[film.name];
  }
}

export interface ViewGroup {
  id: string;
  title: string;
  views: View[];
  setViews: React.Dispatch<React.SetStateAction<View[]>>;
}
