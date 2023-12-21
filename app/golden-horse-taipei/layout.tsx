import ThemeToggle from "@/components/theme-toggle";
import clsx from "clsx";
import { Metadata } from "next";
import { Noto_Serif_TC } from "next/font/google";

const noto = Noto_Serif_TC({
  weight: "700",
  preload: false,
});

export const metadata = {
  title: "台北金馬影展",
} satisfies Metadata;

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-16 min-w-[768px]">
      <div className="grid gap-8 py-8">
        <header className="flex justify-between">
          <h1 className={clsx(noto.className, "text-3xl")}>{metadata.title}</h1>
          <ThemeToggle />
        </header>
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
