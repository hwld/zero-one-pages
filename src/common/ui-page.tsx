"use client";

import { ReactNode, useEffect, useState } from "react";

export const UiPage: React.FC<{
  children: ReactNode;
  minWidth?: number;
  maxWidth?: number;
}> = ({ children, minWidth = 400, maxWidth = Infinity }) => {
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      setIsSupported(width >= minWidth && width <= maxWidth);
    };

    let timer: number;
    const handleResize = () => {
      clearTimeout(timer);
      timer = window.setTimeout(update, 300);
    };

    update();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [maxWidth, minWidth]);

  return isSupported ? (
    children
  ) : (
    <div className="grid h-dvh w-dvw place-items-center bg-zinc-900 text-xs text-zinc-100">
      対応していない画面幅です
    </div>
  );
};
