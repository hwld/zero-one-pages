import type { Metadata } from "next";
import "./globals.css";
import { GlobalNavigation } from "./global-navigation";
import { Providers } from "./providers";

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
        <Providers>{children}</Providers>
        <GlobalNavigation />
      </body>
    </html>
  );
}
