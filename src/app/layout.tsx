import type { Metadata } from "next";
import "./globals.css";
import { GlobalCommand } from "./global-command";
import { Providers } from "./providers";
import { SetupMsw } from "@/mocks/setup-msw";

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
        <Providers>
          {children}
          <GlobalCommand />
          <SetupMsw />
        </Providers>
      </body>
    </html>
  );
}
