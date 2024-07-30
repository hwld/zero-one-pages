import { Fragment, ReactNode, useState } from "react";
import { Kbd, KeyboardKey } from "./kbd";
import {
  autoUpdate,
  FloatingDelayGroup,
  FloatingPortal,
  offset,
  Placement,
  shift,
  useDelayGroup,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
} from "@floating-ui/react";
import { Slot } from "@radix-ui/react-slot";

type Props = {
  label: string;
  keys?: KeyboardKey[];
  children: ReactNode;
  placement?: Placement;
};

export const Tooltip: React.FC<Props> = ({
  label,
  keys,
  children,
  placement,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    placement,
    open: isOpen,
    onOpenChange: setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(4), shift()],
  });

  const { delay } = useDelayGroup(context);
  const hover = useHover(context, { move: false, delay });
  const focus = useFocus(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
  ]);

  return (
    <>
      <Slot ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </Slot>
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="flex h-7 items-center gap-2 rounded bg-stone-800 px-2 text-xs text-stone-100"
            {...getFloatingProps()}
          >
            <p>{label}</p>
            {keys?.length ? (
              <div className="flex items-center gap-1">
                {keys.map((k, i) => {
                  return (
                    <Fragment key={i}>
                      {i !== 0 ? "+" : null}
                      <Kbd>{k}</Kbd>
                    </Fragment>
                  );
                })}
              </div>
            ) : null}
          </div>
        </FloatingPortal>
      )}
    </>
  );
};

export const TooltipDelayGroup: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <FloatingDelayGroup delay={{ open: 500, close: 200 }}>
      {children}
    </FloatingDelayGroup>
  );
};
