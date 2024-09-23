import { PiSpinnerGapBold } from "@react-icons/all-files/pi/PiSpinnerGapBold";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { ComponentPropsWithoutRef, forwardRef } from "react";

type Props = {
  size?: "sm" | "md";
  color?: "primary" | "secondary";
  loading?: boolean;
} & Omit<ComponentPropsWithoutRef<"button">, "className">;

export const Button = forwardRef<HTMLButtonElement, Props>(function Button(
  { size = "md", color = "primary", loading, children, ...props },
  ref,
) {
  const colorClass = {
    primary:
      "bg-rose-700 text-stone-100 hover:bg-rose-800 focus-visible:outline-none ring-rose-400",
    secondary:
      "bg-stone-200 text-stone-700 hover:bg-stone-300 focus-visible:outline-none ring-stone-500",
  };
  const sizeClass = {
    md: "h-8 px-3 text-sm font-medium min-w-16",
    sm: "h-6 text-xs px-2",
  };

  return (
    <button
      ref={ref}
      className={clsx(
        "relative select-none rounded ring-offset-2 transition-all focus-visible:outline-none focus-visible:ring-2 active:scale-95",
        sizeClass[size],
        colorClass[color],
        loading
          ? "pointer-events-none"
          : "disabled:pointer-events-none disabled:opacity-50",
      )}
      {...props}
    >
      <AnimatePresence>
        {loading && (
          <motion.div
            className="absolute inset-0 grid size-full animate-spin place-items-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <PiSpinnerGapBold className="size-[70%]" />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={loading ? { opacity: 0, y: 10 } : false}
        animate={loading ? { opacity: 0 } : { opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
      >
        {children}
      </motion.div>
    </button>
  );
});
