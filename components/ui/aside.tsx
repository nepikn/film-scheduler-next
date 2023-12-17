import { clearLocalConstructor } from "@/lib/localforage";
import clsx from "clsx";
import { Button } from "./button";

interface AsideProp {
  isUserView: boolean;
  handlers: {
    [x: string]: () => void;
  };
}

interface Button {
  name: string;
  disabled?: boolean;
  handleClick: () => void;
}

export function DateFilterAside({ isUserView, handlers }: AsideProp) {
  const disabled = !isUserView;
  const buttons: Button[] = [
    {
      name: "僅篩選週末",
      handleClick: handlers.selectWeekend,
      disabled,
    },
    {
      name: "僅篩選週間", // TODO: 日場
      handleClick: handlers.selectWeekdayMorn,
      disabled,
    },
    {
      name: "日期全選",
      handleClick: handlers.reset,
      disabled,
    },
  ];

  return <Aside {...{ buttons, pos: "left" }} />;
}

export function NameFilterAside({ isUserView, handlers }: AsideProp) {
  const { reverse, clear } = handlers;
  const disabled = !isUserView;
  const buttons: Button[] = [
    {
      name: "反向篩選名稱",
      handleClick: reverse,
      disabled,
    },
    {
      name: "清空名稱篩選",
      handleClick: clear,
      disabled,
    },
    {
      name: "回到預設狀態",
      handleClick: () => {
        clearLocalConstructor();
        location.reload();
      },
    },
  ];

  return <Aside {...{ buttons, pos: "right" }} />;
}

interface Aside {
  buttons: Button[];
  pos: "left" | "right";
}

export default function Aside({ buttons, pos }: Aside) {
  const style = {
    aside: { left: "left-0", right: "right-0" },
    button: { left: "border-l-0", right: "border-r-0" },
  };
  return (
    <aside className={clsx("fixed top-0 py-2", style.aside[pos])}>
      <fieldset className="grid gap-1">
        {buttons.map(({ name, disabled, handleClick }) => (
          <Button
            key={name}
            variant={"outline"}
            onClick={handleClick}
            disabled={disabled}
            className={clsx("p-2", style.button[pos])}
          >
            <div className="whitespace-pre leading-tight">
              {name.split("").join("\n")}
            </div>
          </Button>
        ))}
      </fieldset>
    </aside>
  );
}
