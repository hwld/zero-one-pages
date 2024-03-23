import type { Metadata } from "next";
import "./globals.css";
import { GlobalCommand } from "./_providers/global-command-provider";
import { Providers } from "./_providers/providers";

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
        </Providers>
      </body>
    </html>
  );
}
