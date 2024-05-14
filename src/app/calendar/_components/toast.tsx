import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import * as RxToast from "@radix-ui/react-toast";
import { AnimatePresence, motion } from "framer-motion";
import { TbInfoCircle, TbX } from "react-icons/tb";
import { Button, IconButton } from "./button";

type CloseFn = (option?: { withoutCallback: boolean }) => void;

type Toast = { id: string; title: string; onClose?: () => void } & (
  | { action?: undefined }
  | { action: (params: { close: CloseFn }) => void; actionText: string }
);
// 普通にOmitを使うとkeyofで共有のプロパティしか返さないのでunion distributionを使ってすべてのkeyをリストアップできるようにする
type CreateToastInput<T = Toast> = T extends unknown ? Omit<T, "id"> : never;

type ToastContext = [Toast[], Dispatch<SetStateAction<Toast[]>>];
const ToastContext = createContext<ToastContext | undefined>(undefined);

export const ToastProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const toastState = useState<Toast[]>([]);
  const [toasts, setToasts] = toastState;

  const closeToast = (toast: Toast, option?: { withoutCallback: boolean }) => {
    setToasts((toasts) => toasts.filter((t) => t.id !== toast.id));

    if (!option?.withoutCallback) {
      toast.onClose?.();
    }
  };

  const handleOpenChange = (open: boolean, toast: Toast) => {
    if (open) {
      return;
    }
    closeToast(toast);
  };

  const handleClickClose = (toast: Toast) => {
    closeToast(toast);
  };

  const handleClickAction = (toast: Toast) => {
    toast.action?.({
      close: (option?) => {
        closeToast(toast, option);
      },
    });
  };

  return (
    <ToastContext.Provider value={toastState}>
      <RxToast.Provider>
        {children}
        <AnimatePresence>
          {toasts.map((toast) => {
            return (
              <RxToast.Root
                key={toast.id}
                asChild
                onOpenChange={(o) => handleOpenChange(o, toast)}
                onSwipeStart={(e) => e.preventDefault()}
                onSwipeMove={(e) => e.preventDefault()}
                onSwipeCancel={(e) => e.preventDefault()}
                onSwipeEnd={(e) => e.preventDefault()}
                forceMount
              >
                <motion.div
                  layout
                  className="relative flex min-h-[80px] w-[300px] flex-col justify-between gap-2 rounded border border-neutral-300 bg-neutral-50 p-2 text-neutral-700 shadow"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8, transition: { duration: 0.1 } }}
                >
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <TbInfoCircle size={16} />
                      {toast.title}
                    </div>
                    <IconButton
                      size="sm"
                      icon={TbX}
                      onClick={() => handleClickClose(toast)}
                    />
                  </div>
                  {toast.action && (
                    <div className="flex w-full justify-end">
                      <Button
                        size="sm"
                        onClick={() => handleClickAction(toast)}
                      >
                        {toast.actionText}
                      </Button>
                    </div>
                  )}
                </motion.div>
              </RxToast.Root>
            );
          })}
        </AnimatePresence>
        <RxToast.Viewport className="fixed bottom-4 right-4 z-[100] flex flex-col gap-1" />
      </RxToast.Provider>
    </ToastContext.Provider>
  );
};

const useToastContext = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("ToastProviderが存在しません");
  }
  return ctx;
};

export const useToast = () => {
  const [_, setToasts] = useToastContext();

  const toast = useCallback(
    (input: CreateToastInput) => {
      const id = crypto.randomUUID();
      setToasts((toasts) => [...toasts, { id, ...input }]);

      const close = () => {
        setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
      };

      return { close };
    },
    [setToasts],
  );

  return { toast };
};
