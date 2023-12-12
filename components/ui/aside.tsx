import { clearLocalConstructor } from "@/lib/localforage";
import View from "@/lib/view";
import clsx from "clsx";

interface AsideProp {
  userView: boolean;
  handleClear: () => void;
  handleReverse: () => void;
}

interface Button {
  name: string;
  disabled?: boolean;
  handleClick: () => void;
}

export default function Aside({
  userView,
  handleClear,
  handleReverse,
}: AsideProp) {
  const disabled = !userView;
  const buttons: Button[] = [
    {
      name: "回到預設狀態",
      handleClick: () => {
        clearLocalConstructor();
        location.reload();
      },
    },
    {
      name: "清空名稱篩選",
      disabled: disabled,
      handleClick: handleClear,
    },
    {
      name: "反向篩選名稱",
      disabled: disabled,
      handleClick: handleReverse,
    },
  ];
  return (
    <aside className="fixed right-0 top-0 py-2">
      <fieldset className="grid gap-1">
        {buttons.map(({ name, disabled, handleClick }) => (
          <button
            key={name}
            onClick={handleClick}
            disabled={disabled}
            className={clsx(
              disabled && "text-gray-400",
              "border border-r-0 p-2",
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
