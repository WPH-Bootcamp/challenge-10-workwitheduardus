import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import Providers from "./provider";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Foody – Explore Culinary Experiences",
  description:
    "Search and refine your choice to discover the perfect restaurant.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={clsx(nunito.variable, "antialiased")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
