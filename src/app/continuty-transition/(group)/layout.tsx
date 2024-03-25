"use client";
import { motion } from "framer-motion";
import { XIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";
import { z } from "zod";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const searchParams = useSearchParams();
  const isMenuOpen = !!z.string().nullable().parse(searchParams.get("isOpen"));

  return (
    <>
      <div className="h-screen w-screen"></div>
      <motion.div
        layoutId="panel"
        className="max-w-screen fixed inset-0 max-h-screen min-h-screen overflow-hidden bg-neutral-900 text-neutral-100"
        style={{ colorScheme: "dark" }}
      >
        <motion.span
          layoutId="menu-items"
          className="fixed bottom-0 right-0 size-1 opacity-0"
        />
        <div className="max-h-screen min-h-screen overflow-auto">
          <div className="relative m-auto flex max-w-screen-lg px-3 pt-6">
            <Link
              href={`/continuty-transition${isMenuOpen ? "?isOpen=true" : ""}`}
              className="absolute right-6 top-6"
            >
              <motion.span
                layoutId="button"
                className="grid size-[40px] place-items-center rounded-full transition-colors hover:bg-white/10"
              >
                <XIcon />
              </motion.span>
            </Link>
            <motion.div layout="preserve-aspect">{children}</motion.div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Layout;
