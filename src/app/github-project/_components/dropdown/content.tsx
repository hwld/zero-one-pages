import { useDropdown } from "./provider";
import { ReactNode, useEffect } from "react";
import { AnimatePresence, AnimatePresenceProps } from "framer-motion";
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
} from "@floating-ui/react";

type BaseProps = { onEscapeKeydown?: () => void };

type DropdownContentProps = {
  contentKey?: string;
  children: ReactNode;
  animationMode?: AnimatePresenceProps["mode"];
} & BaseProps;
export const DropdownContent: React.FC<DropdownContentProps> = ({
  children,
  contentKey,
  onEscapeKeydown,
  animationMode,
}) => {
  const { isOpen, refs, getFloatingProps, floatingStyles, context } =
    useDropdown();

  return (
    <AnimatePresence mode={animationMode}>
      {isOpen && (
        <FloatingPortal>
          <FloatingOverlay>
            <FloatingFocusManager context={context}>
              <div
                key={contentKey}
                ref={refs.setFloating}
                {...getFloatingProps({
                  onKeyDown: (e) => {
                    if (e.key === "Escape") {
                      if (onEscapeKeydown) {
                        onEscapeKeydown();
                      } else {
                        context.onOpenChange(false);
                      }
                    }
                  },
                })}
                style={{ ...floatingStyles, colorScheme: "dark" }}
                className="focus-visible:outline-none"
              >
                {children}
              </div>
            </FloatingFocusManager>
          </FloatingOverlay>
        </FloatingPortal>
      )}
    </AnimatePresence>
  );
};

type DropdownMultiContentProps<T extends string> = {
  mode: T;
  contents: Record<T, ReactNode>;
} & BaseProps;
export const DropdownMultiContent = <T extends string>({
  mode,
  contents,
  onEscapeKeydown,
}: DropdownMultiContentProps<T>) => {
  const { setActiveIndex } = useDropdown();

  useEffect(() => {
    setActiveIndex(null);
  }, [mode, setActiveIndex]);

  return (
    <DropdownContent
      contentKey={mode}
      animationMode="wait"
      onEscapeKeydown={onEscapeKeydown}
    >
      {contents[mode]}
    </DropdownContent>
  );
};
