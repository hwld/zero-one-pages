import * as RxPopover from "@radix-ui/react-popover";
import type { ReactNode } from "react";

type Props = { trigger: ReactNode; children: ReactNode };

export const Popover: React.FC<Props> = ({ trigger, children }) => {
  return (
    <RxPopover.Root modal>
      <RxPopover.Trigger asChild>{trigger}</RxPopover.Trigger>
      <RxPopover.Portal>
        <RxPopover.Content
          align="start"
          side="bottom"
          className="z-[10000] h-[350px] w-[300px] overflow-hidden rounded-lg border border-stone-300 bg-stone-50 text-sm text-stone-700 shadow-lg"
        >
          {children}
        </RxPopover.Content>
      </RxPopover.Portal>
    </RxPopover.Root>
  );
};
