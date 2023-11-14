import { formatISO } from "date-fns";
import * as ics from "ics";
import type Film from "./film";

const ADDRESS = {
  MUVIE:
    "台北松仁威秀影城 MUVIE CINEMAS, 110, Taiwan, Taipei City, Xinyi District, Songren Rd, 58號10 樓",
  信義威秀:
    "Vieshow Cinemas Xinyi, No. 20號, Songshou Rd, Xinyi District, Taipei City, Taiwan 110",
};

export function getIcsLink(films: Film[], format = { summary: "電影：%s" }) {
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

  return URL.createObjectURL(new Blob([value]));
}
