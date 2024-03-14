"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { pages } from "./pages";
import Link from "next/link";
import { HomeIcon, LucideIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "cmdk";
import { useRouter } from "next/navigation";

export const GlobalNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const onCloseDialog = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "/" && event.target === document.body) {
        setIsOpen(true);
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <AnimatePresence>
        {isOpen && (
          <DialogPortal forceMount>
            <DialogOverlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </DialogOverlay>
            <DialogContent asChild>
              <motion.div
                className="fixed left-1/2 top-1/2 h-[350px] w-[95%] max-w-[550px] rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200"
                initial={{ opacity: 0, x: "-50%", y: "-60%" }}
                animate={{ opacity: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, x: "-50%", y: "-60%" }}
              >
                <Command className="flex h-full flex-col gap-2">
                  <div className="flex flex-col gap-2 px-4 pt-4">
                    <div className="flex h-5 w-fit items-center rounded bg-white/10 px-2 text-xs text-zinc-400">
                      Navigation
                    </div>
                    <CommandInput
                      placeholder="Where would you like to go?"
                      className="bg-transparent p-1 text-sm placeholder:text-zinc-500 focus-visible:outline-none"
                    />
                  </div>

                  <div className="h-[1px] w-full bg-zinc-600" />

                  <CommandList className="flex flex-col overflow-auto px-4 pb-4">
                    <CommandEmpty className="mt-4 w-full text-center text-sm text-zinc-300">
                      No results found.
                    </CommandEmpty>
                    <NavItem
                      icon={HomeIcon}
                      label="ホーム"
                      href="/"
                      onBeforeNavigate={onCloseDialog}
                    />
                    {pages.map((p) => {
                      return (
                        <NavItem
                          key={p.title}
                          icon={p.icon}
                          label={p.title}
                          href={p.href}
                          onBeforeNavigate={onCloseDialog}
                        />
                      );
                    })}
                  </CommandList>
                </Command>
              </motion.div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

type NavItemProps = {
  icon: LucideIcon;
  href: string;
  label: string;
  onBeforeNavigate: () => void;
};
const NavItem: React.FC<NavItemProps> = ({
  icon: Icon,
  href,
  label,
  onBeforeNavigate,
}) => {
  const router = useRouter();

  const handleNavigate = () => {
    onBeforeNavigate();
    router.push(href);
  };

  return (
    <CommandItem
      className="h-8 rounded px-2 text-sm transition-colors aria-selected:bg-white/10"
      onSelect={handleNavigate}
    >
      <Link
        href={href}
        className="flex h-full items-center gap-2"
        onClick={onBeforeNavigate}
      >
        <Icon size={15} />
        {label}
      </Link>
    </CommandItem>
  );
};
