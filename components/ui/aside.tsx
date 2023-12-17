import { clearLocalConstructor } from "@/lib/localforage";
import clsx from "clsx";

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
  const { selectWeekend, selectWeekday, clear } = handlers;
  const disabled = !isUserView;
  const buttons: Button[] = [
    {
      name: "僅選擇週末",
      disabled: disabled,
      handleClick: selectWeekend,
    },
    {
      name: "僅選擇週間日場",
      disabled: disabled,
      handleClick: selectWeekday,
    },
    {
      name: "清空日期篩選",
      disabled: disabled,
      handleClick: clear,
    },
  ];

  return <Aside {...{ buttons, pos: "left" }} />;
}

export function NameFilterAside({ isUserView, handlers }: AsideProp) {
  const { reverse, clear } = handlers;
  const disabled = !isUserView;
  const buttons: Button[] = [
    {
      name: "回到預設狀態",
      handleClick: () => {
        clearLocalConstructor();
        location.reload();
      },
    },
    {
      name: "反向篩選名稱",
      disabled: disabled,
      handleClick: reverse,
    },
    {
      name: "清空名稱篩選",
      disabled: disabled,
      handleClick: clear,
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
          <button
            key={name}
            onClick={handleClick}
            disabled={disabled}
            className={clsx(
              "border p-2",
              style.button[pos],
              disabled && "text-gray-400",
            )}
          >
            <div className="whitespace-pre leading-tight">
              {name.split("").join("\n")}
            </div>
          </button>
        ))}
      </fieldset>
    </aside>
  );
}
