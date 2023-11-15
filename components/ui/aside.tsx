import { Action } from "@/lib/definitions";

interface AsideProp {
  handleClick: (this: Action) => void;
}

export default function Aside({ handleClick }: AsideProp) {
  return (
    <aside className="fixed right-0 top-0">
      <fieldset>
        <button onClick={handleClick.bind({ type: "clear" })}>
          <div className="whitespace-pre leading-tight">
            {"清空名稱篩選".split("").join("\n")}
          </div>
        </button>
      </fieldset>
    </aside>
  );
}
