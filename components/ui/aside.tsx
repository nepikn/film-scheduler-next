import { AsideAction } from "@/lib/definitions";
import localforage from "localforage";

interface AsideProp {
  handleNameFilterClear: () => void;
  handleNameFilterReverse: () => void;
}

interface Button {
  name: string;
  handleClick: () => void;
}

export default function Aside({
  handleNameFilterClear,
  handleNameFilterReverse,
}: AsideProp) {
  const buttons: Button[] = [
    { name: "清空名稱篩選", handleClick: handleNameFilterClear },
    { name: "反向篩選名稱", handleClick: handleNameFilterReverse },
    { name: "c", handleClick: () => localforage.clear() },
  ];
  return (
    <aside className="fixed right-0 top-0 py-2">
      <fieldset className="grid gap-1">
        {buttons.map(({ name, handleClick }) => (
          <button
            key={name}
            onClick={handleClick}
            className="border border-r-0 p-2"
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
