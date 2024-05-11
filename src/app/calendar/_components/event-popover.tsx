import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  Placement,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { ComponentPropsWithoutRef, ReactNode, useMemo, useState } from "react";
import { Event } from "../_mocks/event-store";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { TbClockHour5, TbPencilMinus, TbTrash, TbX } from "react-icons/tb";
import { IconType } from "react-icons/lib";
import { format, isSameDay, isSameYear } from "date-fns";
import { useDeleteEvent } from "../_queries/use-delete-event";
import { UpdateEventFormDialog } from "./update-event-form-dialog";

type Props = {
  event: Event;
  children: ReactNode;
  isOpen: boolean;
  onChangeOpen: (open: boolean) => void;
  placement?: Placement;
};

export const EventPopover: React.FC<Props> = ({
  event,
  children,
  isOpen,
  onChangeOpen,
  placement = "bottom",
}) => {
  const isPresent = useIsPresent();

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: onChangeOpen,
    placement,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  });
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([dismiss]);

  const deleteEvent = useDeleteEvent();
  const handleDelete = () => {
    deleteEvent(event.id);
  };

  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);

  return (
    <>
      <Slot ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </Slot>
      <AnimatePresence>
        {isOpen && isPresent && (
          <FloatingPortal>
            <FloatingOverlay
              lockScroll
              className="z-[100]"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <FloatingFocusManager context={context}>
                <div
                  ref={refs.setFloating}
                  style={floatingStyles}
                  {...getFloatingProps()}
                >
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.1 }}
                    className="w-[320px] space-y-2 rounded-lg border border-neutral-300 bg-neutral-100 text-neutral-700 shadow"
                  >
                    <div className="flex items-center justify-between px-2 pt-2">
                      <div className="text-xs text-neutral-400">
                        イベント詳細
                      </div>
                      <div className="flex">
                        <EventPopoverButton
                          icon={TbPencilMinus}
                          onClick={() => {
                            onChangeOpen(false);
                            setIsUpdateDialogOpen(true);
                          }}
                        />
                        <EventPopoverButton
                          icon={TbTrash}
                          onClick={handleDelete}
                        />
                        <EventPopoverButton
                          autoFocus
                          icon={TbX}
                          onClick={() => onChangeOpen(false)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 px-4 pb-4">
                      <div className="font-bold">{event.title}</div>
                      <div className="flex items-center gap-1 text-sm">
                        <TbClockHour5 size={18} className="shrink-0" />
                        <EventPeriod event={event} />
                      </div>
                    </div>
                  </motion.div>
                </div>
              </FloatingFocusManager>
            </FloatingOverlay>
          </FloatingPortal>
        )}
      </AnimatePresence>
      <UpdateEventFormDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        eventId={event.id}
        defaultFormValues={event}
      />
    </>
  );
};

const EventPeriod: React.FC<{ event: Event }> = ({ event }) => {
  const content = useMemo(() => {
    const { start, end } = event;

    const now = Date.now();

    // どちらかが今年ではなければどちらの年月も表示する
    const showYear = !(isSameYear(now, start) && isSameYear(now, end));

    const startYearOrNone = showYear ? format(start, "yyyy年") : "";
    const startDate = format(start, "M月d日");
    const startTime = format(event.start, "HH:mm");

    const endYearOrNone = showYear ? format(end, "yyyy年") : "";
    const endDate = format(end, "M月d日");
    const endTime = format(end, "HH:mm");

    const wave = <span className="mx-2">~</span>;

    if (event.allDay) {
      return (
        <>
          {startYearOrNone}
          {startDate}
          {wave}
          {endYearOrNone}
          {endDate}
        </>
      );
    } else if (isSameDay(start, end)) {
      return (
        <>
          {startYearOrNone}
          {startDate}・{startTime}
          {wave}
          {endTime}
        </>
      );
    } else {
      return (
        <>
          {startYearOrNone}
          {startDate}・{startTime}
          {wave}
          {showYear ? <br /> : ""}
          {endYearOrNone}
          {endDate}・{endTime}
        </>
      );
    }
  }, [event]);

  return <div className="tabular-nums">{content}</div>;
};

const EventPopoverButton: React.FC<
  { icon: IconType } & ComponentPropsWithoutRef<"button">
> = ({ icon: Icon, ...props }) => {
  return (
    <button
      className="grid size-7 place-items-center rounded text-neutral-600 ring-neutral-500 transition-colors hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2"
      {...props}
    >
      <Icon size="60%" />
    </button>
  );
};
