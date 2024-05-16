import * as RxSelect from "@radix-ui/react-select";
import { TbCheck, TbChevronDown } from "react-icons/tb";
import { Button } from "./button";
import { forwardRef, useState } from "react";

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
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    onSelect(value as T);
  };

  return (
    <RxSelect.Root
      open={open}
      value={value}
      onOpenChange={setOpen}
      onValueChange={handleSelect}
    >
      <RxSelect.Trigger asChild>
        <Button active={open}>
          <div className="flex items-center gap-2">
            <RxSelect.Value />
            <RxSelect.Icon>
              <TbChevronDown />
            </RxSelect.Icon>
          </div>
        </Button>
      </RxSelect.Trigger>

      <RxSelect.Portal>
        <RxSelect.Content
          position="popper"
          side="bottom"
          sideOffset={4}
          className="min-w-[150px] rounded border border-neutral-300 bg-neutral-50 p-[2px] text-sm text-neutral-700 shadow data-[state=open]:animate-in data-[state=open]:slide-in-from-top-1"
        >
          <RxSelect.Viewport>
            {items.map((item) => {
              return (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  option={item.option}
                >
                  {item.label}
                </SelectItem>
              );
            })}
          </RxSelect.Viewport>
        </RxSelect.Content>
      </RxSelect.Portal>
    </RxSelect.Root>
  );
};

const SelectItem = forwardRef<
  HTMLDivElement,
  RxSelect.SelectItemProps & { option?: string }
>(function SelectItem({ children, option, ...props }, ref) {
  return (
    <RxSelect.SelectItem
      ref={ref}
      {...props}
      className="relative flex h-7 cursor-pointer items-center justify-between gap-2 rounded pl-[25px] pr-2 transition-colors data-[highlighted]:bg-neutral-200 data-[highlighted]:outline-none"
    >
      <RxSelect.ItemIndicator className="absolute left-1 top-1/2 -translate-y-1/2 text-[17px]">
        <TbCheck />
      </RxSelect.ItemIndicator>
      <RxSelect.ItemText>{children}</RxSelect.ItemText>
      {option && <div className="text-xs text-neutral-500">{option}</div>}
    </RxSelect.SelectItem>
  );
});
