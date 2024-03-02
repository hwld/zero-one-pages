import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  confirmText: string;
  children: ReactNode;
};

export const ConfirmDialog: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  onConfirm,
  title,
  confirmText,
  children,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <DialogPortal forceMount>
            <DialogOverlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </DialogOverlay>
            <DialogContent asChild>
              <motion.div
                className="fixed left-1/2 top-1/2 w-full max-w-[500px] overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-100"
                initial={{ opacity: 0, x: "-50%", y: "-60%" }}
                animate={{ opacity: 1, x: "-50%", y: "-50%" }}
                exit={{ opacity: 0, x: "-50%", y: "-60%" }}
              >
                <div className="p-4 text-lg font-bold">{title}</div>
                <div className="min-h-[100px] px-4 pb-4">{children}</div>
                <div className="flex items-center justify-end gap-4 border-t border-zinc-700 bg-black/30 p-4">
                  <button
                    className="rounded border border-zinc-500 p-2 text-xs transition-colors hover:bg-white/10"
                    onClick={() => onOpenChange(false)}
                  >
                    キャンセルする
                  </button>
                  <button
                    className="rounded bg-zinc-100 p-2 text-xs text-zinc-700 transition-colors hover:bg-zinc-300"
                    onClick={onConfirm}
                  >
                    {confirmText}
                  </button>
                </div>
              </motion.div>
            </DialogContent>
          </DialogPortal>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
