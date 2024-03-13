import {
  FloatingArrow,
  FloatingPortal,
  arrow,
  autoUpdate,
  offset,
  useFloating,
} from "@floating-ui/react";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { AlertCircleIcon } from "lucide-react";
import { ReactNode, useRef } from "react";

type Props = {
  className?: string;
  children: ReactNode;
  error?: string;
  placement?: "top-start" | "bottom-start";
};

const ARROW_HEIGHT = 10;

export const TaskFormErrorTooltip: React.FC<Props> = ({
  className,
  children,
  error,
  placement = "top-start",
}) => {
  // 祖先コンポーネントのexitアニメーション中にtooltipが表示されないようにする。
  const isPresent = useIsPresent();
  const arrowRef = useRef(null);
  const { refs, floatingStyles, context } = useFloating({
    placement,
    middleware: [arrow({ element: arrowRef }), offset(ARROW_HEIGHT + 3)],
    whileElementsMounted: autoUpdate,
  });

  const initialY = placement === "top-start" ? 5 : -5;

  return (
    <>
      <div className={className} ref={refs.setReference}>
        {children}
      </div>
      <AnimatePresence>
        {isPresent && error && (
          <FloatingPortal>
            <div ref={refs.setFloating} style={floatingStyles}>
              <motion.div
                className="flex gap-1 rounded bg-zinc-950 p-2 text-xs text-red-400 shadow"
                initial={{ opacity: 0, y: initialY }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: initialY }}
              >
                <AlertCircleIcon size={15} />
                {error}
                <FloatingArrow
                  ref={arrowRef}
                  context={context}
                  height={ARROW_HEIGHT}
                  staticOffset={"10px"}
                />
              </motion.div>
            </div>
          </FloatingPortal>
        )}
      </AnimatePresence>
    </>
  );
};
