import "./globals.css";
import type { Metadata } from "next";
import { Provider } from "@/components/provider";

export const metadata: Metadata = {
  title: { template: "觀影排程 - %s", default: "觀影排程" },
  generator: "Next.js",
  // applicationName: "Kaminari",
  referrer: "origin-when-cross-origin",
  // keywords: [
  //   "Next.js",
  //   "React",
  //   "JavaScript",
  //   "Boilerplate",
  //   "Template",
  //   "shadcn-ui",
  // ],
  authors: [{ name: "PCH", url: "https://github.com/nepikn" }],
  colorScheme: "dark light",
  creator: "PCH",
  publisher: "PCH",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://nepikn.vercel.app"),
  alternates: {},
  // openGraph: {
  //   title: "金馬國際觀影排程",
  //   description: "Next.js, TailwindCSS and shadcn-ui Starter Template",
  //   url: "https://kaminari.vercel.app",
  //   siteName: "Kaminari",
  //   images: [
  //     {
  //       url: "https://kaminari.vercel.app/og.png",
  //       width: 800,
  //       height: 600,
  //     },
  //     {
  //       url: "https://kaminari.vercel.app/og-dark.png",
  //       width: 1800,
  //       height: 1600,
  //       alt: "Next.js, TailwindCSS and shadcn-ui Starter Template",
  //     },
  //   ],
  //   locale: "en-US",
  //   type: "website",
  // },
  robots: {
    index: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className="bg-stone-100 text-[15px] text-stone-900 dark:bg-neutral-800 dark:text-neutral-200 dark:selection:bg-blue-300">
        <Provider attribute="class">{children}</Provider>
      </body>
    </html>
  );
}
