import { InputHTMLAttributes, ReactElement, useState } from "react";
import Film from "../../lib/Film";
import View from "../../lib/View";
import { TableTitle } from "./Table";
import Filter from "../../lib/Filter";
import { cn } from "@/lib/utils";
import clsx from "clsx";

type Input = Partial<HTMLInputElement>;
export interface TableInput extends Input {
  name: TableTitle;
  value: string;
}

interface Checkbox extends TableInput {
  checked: boolean;
}

export interface FilterCheckbox extends Checkbox {
  name: keyof Omit<InstanceType<typeof Filter>, "validFilms" | "validViews">;
}

export interface ViewRadio {
  name: "view";
  value: View["id"];
}

export interface RemoveButton {}

interface InputProp {
  name: TableTitle;
  // val: string | boolean
  film: Film;
  view: View;
  disabled?: boolean;
  className?: string;
  handleChange: (input: TableInput) => void;
}

export default function Input({
  name,
  film,
  view,
  disabled,
  className,
  handleChange,
}: InputProp) {
  // const [val, setVal] = useState(
  //   name == "join" ? view.getChecked(film) : film[name]
  // );
  const type: { [Key in TableTitle]: string } = {
    name: "string",
    date: "date",
    start: "time",
    end: "time",
    join: "checkbox",
  };
  return (
    <input
      type={type[name]}
      value={name == "name" ? film[name] : undefined}
      defaultValue={name != "join" && name != "name" ? film[name] : undefined}
      // value={name != "join" ? film[name] : undefined}
      name={name}
      checked={name == "join" ? view.getChecked(film) : undefined}
      disabled={disabled}
      data-id={film.id}
      className={clsx("cursor-pointer disabled:cursor-default", className)}
      onChange={(e) => handleChange(e.target as TableInput)}
    />
  );
}
