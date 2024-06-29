import {
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
} from "@floating-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { appHeaderHeightPx } from "../app-header/app-header";
import { TaskDetailPanelContent } from "./panel-content";
import { useSearchParams } from "../../use-search-params";
import { DetailSearchParamsSchema, Routes } from "../../routes";

const overlayClass = "detail-panel-overlay";

export const TaskDetailPanel: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams(DetailSearchParamsSchema);

  const taskId = useMemo(() => {
    const { taskId, panel } = searchParams;

    if (panel === "detail" && typeof taskId === "string" && taskId !== "") {
      return taskId;
    }

    return undefined;
  }, [searchParams]);

  const closePanel = () => {
    router.push(Routes.home({ viewId: searchParams.viewId }));
  };

  const { refs, context } = useFloating({
    open: !!taskId,
    onOpenChange: (open) => {
      if (!open) {
        closePanel();
      }
    },
  });

  const dismiss = useDismiss(context, {
    outsidePress: (event) => {
      const target = event.target;

      if (target instanceof Element) {
        return !!target.closest(`.${overlayClass}`);
      }

      return false;
    },
  });

  const { getFloatingProps } = useInteractions([dismiss]);

  return (
    <FloatingPortal>
      <AnimatePresence>
        {taskId && (
          <FloatingOverlay
            className={`${overlayClass}`}
            style={{
              top: "var(--header-height)",
              ["--header-height" as string]: appHeaderHeightPx,
              colorScheme: "dark",
            }}
          >
            <motion.div
              className="fixed inset-0 top-[var(--header-height)] bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div ref={refs.setFloating} {...getFloatingProps()}>
                <motion.div
                  className="fixed inset-y-0 right-0 top-[var(--header-height)] w-full max-w-[1100px] rounded-l-md border border-neutral-600 bg-neutral-900 text-neutral-100 shadow"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                >
                  <TaskDetailPanelContent
                    taskId={taskId}
                    onClose={closePanel}
                  />
                </motion.div>
              </div>
            </motion.div>
          </FloatingOverlay>
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
};
