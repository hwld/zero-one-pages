import { ReactNode } from "react";
import * as RadixDialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";

export const Dialog: React.FC<{
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  titleText: string;
  cancelText: string;
  actionText: string;
  onAction: () => void;
  children: ReactNode;
}> = ({
  isOpen,
  onOpenChange,
  titleText,
  cancelText,
  actionText,
  onAction,
  children,
}) => {
  return (
    <RadixDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <RadixDialog.Portal forceMount>
            <RadixDialog.Overlay asChild>
              <motion.div className="fixed inset-0 bg-black/15" />
            </RadixDialog.Overlay>

            <RadixDialog.Content asChild>
              <motion.div
                className="fixed left-1/2 top-1/2 flex min-h-[200px] w-[500px] max-w-[95%] flex-col overflow-hidden rounded-lg border border-neutral-300 bg-neutral-100 text-neutral-600"
                initial={{ opacity: 0, translateX: "-50%", translateY: "-50%" }}
                animate={{ opacity: 1, translateX: "-50%", translateY: "-40%" }}
                exit={{ opacity: 0, translateX: "-50%", translateY: "-50%" }}
              >
                <RadixDialog.Close asChild>
                  <button className="absolute right-2 top-2 rounded p-1 text-neutral-100 transition-colors hover:bg-white/20">
                    <XIcon />
                  </button>
                </RadixDialog.Close>
                <div className="bg-neutral-900 p-4 text-lg font-bold text-neutral-100">
                  {titleText}
                </div>
                <div className="grow p-4">{children}</div>
                <div className="flex justify-end gap-2 p-4">
                  <button
                    className="rounded border border-neutral-300 px-3 py-2 text-sm transition-colors hover:bg-neutral-200"
                    onClick={() => onOpenChange(false)}
                  >
                    {cancelText}
                  </button>
                  <button
                    className="rounded bg-neutral-900 px-3 py-2 text-sm text-neutral-100 hover:bg-neutral-700"
                    onClick={onAction}
                  >
                    {actionText}
                  </button>
                </div>
              </motion.div>
            </RadixDialog.Content>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  );
};
