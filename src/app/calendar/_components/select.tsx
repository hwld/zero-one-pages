import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./button";
import { TbCheck, TbChevronDown } from "react-icons/tb";

type Props<T extends string> = {
  value: T;
  items: { value: T; label: string; option?: string }[];
  onSelect: (v: T) => void;
};

export const Select = <T extends string>({
  value,
  items,
  onSelect,
}: Props<T>) => {
  const selectedItem = items.find((item) => item.value === value);

  return (
    <Listbox
      value={selectedItem}
      onChange={(e) => {
        onSelect(e.value);
      }}
    >
      {({ open, value }) => {
        return (
          <>
            <ListboxButton as={Button} active={open}>
              <div className="flex items-center justify-between gap-1">
                <div>{value.label}</div>
                <TbChevronDown />
              </div>
            </ListboxButton>
            <AnimatePresence>
              {open && (
                <ListboxOptions
                  static
                  as={motion.div}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.1 }}
                  anchor={{ to: "bottom start", gap: "4px", padding: "4px" }}
                  className="min-w-[150px] origin-top rounded border border-neutral-300 bg-neutral-50 p-[2px] text-sm text-neutral-700 shadow focus:outline-none"
                >
                  {items.map((item) => {
                    return (
                      <ListboxOption
                        key={item.value}
                        value={item}
                        className="group flex h-7 cursor-pointer items-center justify-between gap-2 rounded px-2 text-sm transition-colors data-[focus]:bg-neutral-200"
                      >
                        <div className="flex items-center gap-1">
                          <TbCheck
                            className="invisible group-data-[selected]:visible"
                            size={16}
                          />
                          {item.label}
                        </div>
                        {item.option && (
                          <div className="text-xs text-neutral-500">
                            {item.option}
                          </div>
                        )}
                      </ListboxOption>
                    );
                  })}
                </ListboxOptions>
              )}
            </AnimatePresence>
          </>
        );
      }}
    </Listbox>
  );
};
