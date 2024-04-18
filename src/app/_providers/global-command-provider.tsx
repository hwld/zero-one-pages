"use client";

import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { pages } from "../pages";
import Link from "next/link";
import { HomeIcon, LucideIcon } from "lucide-react";
import { Command } from "cmdk";
import { usePathname, useRouter } from "next/navigation";

export type CommandItem = {
  id: string;
  icon: LucideIcon;
  label: string;
  action: () => Promise<unknown> | void;
};

type GlobalCommandData = { commands: CommandItem[] };

const GlobalCommandDataContext = createContext<GlobalCommandData | undefined>(
  undefined,
);
export const useGlobalCommandData = (): GlobalCommandData => {
  const context = useContext(GlobalCommandDataContext);
  if (context === undefined) {
    throw new Error("GlobalCommandProviderが存在しません。");
  }
  return context;
};

type GlobalCommandAction = {
  addCommandItems: (items: CommandItem[]) => void;
  removeCommandItems: (ids: string[]) => void;
};

const GlobalCommandActionContext = createContext<
  GlobalCommandAction | undefined
>(undefined);
const useGlobalCommandAction = (): GlobalCommandAction => {
  const context = useContext(GlobalCommandActionContext);
  if (context === undefined) {
    throw new Error("GLobalCOmmandProviderが存在しません。");
  }
  return context;
};

export const GlobalCommandProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<GlobalCommandData>({
    commands: [],
  });

  const action: GlobalCommandAction = useMemo(() => {
    return {
      addCommandItems: (newItems) => {
        setData((data) => {
          return {
            ...data,
            commands: Array.from(new Set([...data.commands, ...newItems])),
          };
        });
      },
      removeCommandItems: (itemIds) => {
        setData((data) => {
          return {
            ...data,
            commands: data.commands.filter((i) => !itemIds.includes(i.id)),
          };
        });
      },
    };
  }, []);

  return (
    <GlobalCommandDataContext.Provider value={data}>
      <GlobalCommandActionContext.Provider value={action}>
        {children}
      </GlobalCommandActionContext.Provider>
    </GlobalCommandDataContext.Provider>
  );
};

export type GlobalCommandConfig = {
  newCommands: Omit<CommandItem, "id">[];
};
export const useGlobalCommandConfig = ({
  newCommands,
}: GlobalCommandConfig) => {
  const { addCommandItems, removeCommandItems } = useGlobalCommandAction();

  useEffect(() => {
    const commands = newCommands.map((c) => ({
      ...c,
      id: crypto.randomUUID(),
    }));

    addCommandItems(commands);

    return () => {
      removeCommandItems(commands.map((c) => c.id));
    };
  }, [addCommandItems, newCommands, removeCommandItems]);
};

export const GlobalCommand: React.FC = () => {
  const pathname = usePathname();
  const currentPage = `/${pathname.split("/")[1]}`;

  const { commands } = useGlobalCommandData();
  const [isOpen, setIsOpen] = useState(false);

  const onCloseDialog = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (
        event.key === "/" &&
        !(
          event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement
        )
      ) {
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
                className="fixed left-1/2 top-1/2 h-[350px] w-[95%] max-w-[550px] overflow-hidden rounded-lg border border-neutral-700 bg-neutral-900 text-neutral-200"
                initial={{ opacity: 0, x: "-50%", y: "-60%" }}
                animate={{ opacity: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, x: "-50%", y: "-60%" }}
                style={{ colorScheme: "dark" }}
              >
                <Command className="flex h-full flex-col" loop>
                  <div className="flex flex-col gap-2 px-4 pt-4">
                    <div className="flex h-5 w-fit items-center rounded bg-white/10 px-2 text-xs text-neutral-400">
                      {currentPage}
                    </div>
                    <Command.Input
                      placeholder="Type a page or command..."
                      className="bg-transparent p-1 text-sm placeholder:text-neutral-500 focus-visible:outline-none"
                    />
                  </div>

                  <div className="mt-2 h-[1px] w-full bg-neutral-600" />

                  <Command.List className="flex h-full scroll-p-2 flex-col overflow-auto p-2">
                    <Command.Empty className="mt-4 w-full text-center text-sm text-neutral-300">
                      No results found.
                    </Command.Empty>
                    <div className="space-y-2">
                      <Group heading="pages">
                        <PageItem
                          icon={HomeIcon}
                          label="ホーム"
                          href="/"
                          onBeforeNavigate={onCloseDialog}
                        />
                        {pages.map((p) => {
                          return (
                            <PageItem
                              key={p.title}
                              icon={p.icon}
                              label={p.title}
                              href={p.href}
                              onBeforeNavigate={onCloseDialog}
                            />
                          );
                        })}
                      </Group>
                      {commands.length > 0 && (
                        <Group heading="commands">
                          {commands.map((command) => {
                            return (
                              <CommandItem
                                key={command.id}
                                command={command}
                                onAfterAction={onCloseDialog}
                              />
                            );
                          })}
                        </Group>
                      )}
                    </div>
                  </Command.List>
                </Command>
              </motion.div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
};

const Group: React.FC<{ heading: string; children: ReactNode }> = ({
  heading,
  children,
}) => {
  return (
    <Command.Group
      heading={heading}
      className="[&>*[cmdk-group-heading]]:mb-1 [&>*[cmdk-group-heading]]:text-xs [&>*[cmdk-group-heading]]:text-neutral-400"
    >
      {children}
    </Command.Group>
  );
};

type PageItemProps = {
  icon: LucideIcon;
  href: string;
  label: string;
  onBeforeNavigate: () => void;
};
const PageItem: React.FC<PageItemProps> = ({
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
    <Command.Item
      className="h-8 rounded px-2 text-sm transition-colors aria-selected:bg-white/10"
      onSelect={handleNavigate}
      keywords={["page"]}
    >
      <Link
        href={href}
        className="flex h-full items-center justify-between"
        onClick={onBeforeNavigate}
      >
        <div className="flex items-center gap-2">
          <Icon size={15} />
          <div>{label}</div>
        </div>
        <div className="text-xs text-neutral-400">{href}</div>
      </Link>
    </Command.Item>
  );
};

type CommandItemProps = { command: CommandItem; onAfterAction?: () => void };
const CommandItem: React.FC<CommandItemProps> = ({
  command,
  onAfterAction,
}) => {
  const Icon = command.icon;

  return (
    <Command.Item
      keywords={["command"]}
      className="flex h-8 cursor-pointer items-center gap-2 rounded px-2 text-sm transition-colors aria-selected:bg-white/10"
      onSelect={async () => {
        await command.action();
        onAfterAction?.();
      }}
    >
      <Icon size={15} />
      {command.label}
    </Command.Item>
  );
};
