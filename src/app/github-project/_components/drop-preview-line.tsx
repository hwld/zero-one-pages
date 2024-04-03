import clsx from "clsx";

type Props = { className?: string };
export const DropPreviewLine: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={clsx("absolute h-[4px] rounded-full bg-blue-500", className)}
    />
  );
};
