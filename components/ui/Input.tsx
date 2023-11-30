import React from "react";
import Film from "../../lib/film";
import View from "../../lib/view";
import { FilmPropKey } from "@/lib/definitions";
import clsx from "clsx";
import { FilmConfig } from "@/lib/definitions";

interface FilmInputProp {
  prop: FilmPropKey;
  film: Film;
  // view: View;
  checked?: boolean;
  disabled?: boolean;
  className?: string;
  handleChange: (k: FilmConfig) => void;
}

const type: { [k in FilmPropKey]: string } = {
  name: "string",
  date: "date",
  start: "time",
  end: "time",
  join: "checkbox",
};

export default function FilmInput({
  prop,
  film,
  // view,
  checked,
  className,
  handleChange,
}: FilmInputProp) {
  // const [val, setVal] = useState(
  //   name == "join" ? view.getChecked(film) : film[name]
  // );
  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    type: type[prop],
    value: prop == "name" ? film[prop] : undefined,
    defaultValue: prop != "join" && prop != "name" ? film[prop] : undefined,
    // value=name != "join" ? film[name] : undefined,
    name: prop,
    className: clsx("cursor-pointer disabled:cursor-default", className),
  };

  if (prop == "join") {
    inputProps.checked = checked;
    inputProps.onChange = (e) =>
      handleChange({
        propChange: prop,
        checked: e.target.checked,
      });
  } else {
    inputProps.onChange = (e) =>
      handleChange({
        propChange: prop,
        nextValue: e.target.value,
      });
  }

  return <input {...inputProps} />;
}
