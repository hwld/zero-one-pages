import * as RxDialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

type DialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  width?: number;
};

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onOpenChange,
  children,
  width = 450,
}) => {
  return (
    <RxDialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {isOpen && (
          <RxDialog.Portal forceMount>
            <RxDialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-[99] bg-black/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              />
            </RxDialog.Overlay>
            <RxDialog.Content style={{ width }} asChild>
              <motion.div
                className="fixed inset-[50%] z-[100] h-min max-h-[90%] w-[500px] rounded-lg bg-stone-100 text-stone-700 shadow-md outline-none"
                initial={{ opacity: 0, y: "-55%", x: "-50%" }}
                animate={{ opacity: 1, y: "-50%", x: "-50%" }}
                exit={{ opacity: 0, y: "-55%", x: "-50%" }}
                transition={{ duration: 0.1 }}
              >
                {children}
              </motion.div>
            </RxDialog.Content>
          </RxDialog.Portal>
        )}
      </AnimatePresence>
    </RxDialog.Root>
  );
};

export const DialogTitle: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <RxDialog.Title className="text-md px-4 pb-2 pt-4 font-bold">
      {children}
    </RxDialog.Title>
  );
};

export const DialogContent: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <div className="px-4 text-sm">{children}</div>;
};

export const DialogActions: React.FC<{
  children: ReactNode;
  left?: ReactNode;
}> = ({ children, left }) => {
  return (
    <div className="flex items-center justify-between px-4 pb-4 pt-6">
      <div>{left}</div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
};
