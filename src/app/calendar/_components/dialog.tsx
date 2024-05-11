import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  isOpen: boolean;
  onChangeOpen: (open: boolean) => void;
};
export const Dialog: React.FC<Props> = ({ children, isOpen, onChangeOpen }) => {
  const { refs, context } = useFloating({
    open: isOpen,
    onOpenChange: onChangeOpen,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);

  const { getFloatingProps } = useInteractions([click, dismiss]);

  return (
    <AnimatePresence>
      {isOpen && (
        <FloatingPortal>
          <FloatingOverlay
            lockScroll
            className="z-50 bg-black/5"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <FloatingFocusManager context={context}>
              <div ref={refs.setFloating} {...getFloatingProps()}>
                <motion.div
                  className="fixed left-1/2 top-1/2 w-[470px] rounded-lg border border-neutral-300 bg-neutral-100 p-4 text-neutral-700 shadow-lg"
                  initial={{ x: "-50%", y: "-60%", opacity: 0 }}
                  animate={{ x: "-50%", y: "-50%", opacity: 1 }}
                  exit={{ x: "-50%", y: "-60%", opacity: 0 }}
                  transition={{ duration: 0.1 }}
                >
                  {children}
                </motion.div>
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      )}
    </AnimatePresence>
  );
};
