import type { Metadata } from "next";
import "./globals.css";
import { GlobalNavigation } from "./global-navigation";

export const metadata: Metadata = {
  title: "Zero one ui",
  description: "page layouts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        {children}
        <GlobalNavigation />
      </body>
    </html>
  );
}
