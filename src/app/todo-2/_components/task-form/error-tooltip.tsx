import {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
  PopoverContentProps,
  PopoverPortal,
} from "@radix-ui/react-popover";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircleIcon } from "lucide-react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  error?: string;
  align?: PopoverContentProps["align"];
  side?: PopoverContentProps["side"];
};

export const TaskFormErrorTooltip: React.FC<Props> = ({
  children,
  error,
  align = "start",
  side = "top",
}) => {
  return (
    <Popover open={!!error}>
      <PopoverAnchor>{children}</PopoverAnchor>
      <AnimatePresence>
        {error && (
          <PopoverPortal forceMount>
            <PopoverContent
              align={align}
              side={side}
              sideOffset={4}
              asChild
              onOpenAutoFocus={(e) => e.preventDefault()}
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <motion.div
                className="flex gap-1 rounded bg-zinc-950 p-2 text-xs text-red-400 shadow"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <AlertCircleIcon size={15} />
                {error}
                <PopoverArrow className="fill-zinc-900" />
              </motion.div>
            </PopoverContent>
          </PopoverPortal>
        )}
      </AnimatePresence>
    </Popover>
  );
};
