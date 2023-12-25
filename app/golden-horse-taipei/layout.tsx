import ThemeToggle from "@/components/theme-toggle";
import clsx from "clsx";
import { Metadata } from "next";
import { Noto_Serif_TC } from "next/font/google";

const noto = Noto_Serif_TC({
  weight: ["600", "700"],
  preload: false,
});

export const metadata = {
  title: "2023 台北金馬影展",
} satisfies Metadata;

export default function Layout({ children }: { children: React.ReactNode }) {
  const [year, fest] = metadata.title.split(" ");
  return (
    <div className="mx-16 min-w-[768px]">
      <div className="grid gap-8 py-10">
        <header className="flex justify-between">
          <h1 className={clsx(noto.className, "text-4xl font-bold")}>
            觀影排程
          </h1>
          <ThemeToggle />
        </header>
        <h2 className={clsx("text-2xl")}>
          <span className="font-serif">{year}</span>&nbsp;
          <span className={clsx(noto.className, "font-semibold")}>{fest}</span>
        </h2>
        {children}
      </div>
      <footer className="p-6 text-center font-serif">
        <p>
          <span className="text-gray-400">資料來源</span>{" "}
          <a target="_blank" href="https://www.goldenhorse.org.tw">
            台北金馬影展
          </a>
        </p>
        <p className="text-gray-400">
          © {new Date().getFullYear()}{" "}
          <a target="_blank" href="https://github.com/nepikn">
            Pin-Chien Ho
          </a>
        </p>
      </footer>
    </div>
  );
}
