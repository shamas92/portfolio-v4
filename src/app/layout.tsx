import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shamas Ur Rehman — Software Engineer, Dresden",
  description:
    "Personal portfolio of Shamas Ur Rehman, MSc Computer Science student at TU Dresden. Five shipped systems, each shown with its proof.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
