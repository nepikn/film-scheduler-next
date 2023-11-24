import Film from "@/lib/film";
import getIcsLink from "@/lib/ics";
import View from "@/lib/view";

export default function IcsDownloadLink(prop: {
  filteredFilms: Film[];
  view: View;
}) {
  return (
    <a
      download={"金馬.ics"}
      href={getIcsLink(
        prop.filteredFilms.filter((film) => prop.view.getJoinStatus(film)),
      )}
      className="flex h-full items-center rounded border border-zinc-200 bg-white px-3 py-3 leading-none shadow-sm hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-neutral-600 dark:hover:text-zinc-50"
    >
      <span>下載 ics</span>
    </a>
  );
}
