import Film from "@/lib/film";
import View from "@/lib/view";
import { formatISO } from "date-fns";
import * as ics from "ics";
import { Button } from "./button";

export default function IcsDownloader({
  filteredFilms,
  view,
}: {
  filteredFilms: Film[];
  view: View;
}) {
  const joinedFilms = filteredFilms.filter((film) => view.getJoinStatus(film));
  return (
    <Button
      size="sm"
      className="h-full p-0 rounded"
      variant="secondary"
      disabled={!joinedFilms.length}
    >
      <a
        download={"金馬.ics"}
        href={getIcsLink(joinedFilms)}
        className="grid h-full items-center p-2"
      >
        <span>下載 ics</span>
      </a>
    </Button>
  );
}

const ADDRESS = {
  MUVIE:
    "台北松仁威秀影城 MUVIE CINEMAS, 110, Taiwan, Taipei City, Xinyi District, Songren Rd, 58號10 樓",
  信義威秀:
    "Vieshow Cinemas Xinyi, No. 20號, Songshou Rd, Xinyi District, Taipei City, Taiwan 110",
};

function getIcsLink(films: Film[], format = { summary: "電影：%s" }) {
  const { error, value } = ics.createEvents(
    films.map((film) => {
      const [theater, screen] = film.venue.split(" ") as [
        keyof typeof ADDRESS,
        string?,
      ];

      return {
        start: formatISO(film.time.start)
          .split(/-|T|:|\+/)
          .map((s) => +s)
          .slice(0, 5) as [number, number, number, number, number],
        duration: {
          hours: Math.floor(film.duration / 60),
          minutes: film.duration % 60,
        },
        title: format.summary.replace("%s", film.name),
        description: screen ?? "",
        location: ADDRESS[theater],
      };
    }),
  );

  if (error || !value) {
    console.error(error);
    return;
  }

  return window && URL.createObjectURL(new Blob([value]));
}
