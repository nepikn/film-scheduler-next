import { AsideAction } from "@/lib/definitions";

interface AsideProp {
  handleNameFilterClear: () => void;
}

export default function Aside({
  handleNameFilterClear: handleClick,
}: AsideProp) {
  return (
    <aside className="fixed right-0 top-0">
      <fieldset>
        <button onClick={handleClick}>
          <div className="whitespace-pre leading-tight">
            {"清空名稱篩選".split("").join("\n")}
          </div>
        </button>
      </fieldset>
    </aside>
  );
}
