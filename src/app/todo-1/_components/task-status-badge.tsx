import clsx from "clsx";

export const TaskStatusBadge: React.FC<{
  done: boolean;
  onChangeDone: () => void;
}> = ({ done, onChangeDone }) => {
  return (
    <button
      onClick={onChangeDone}
      className={clsx(
        "min-w-[70px] rounded-full border p-1 px-3 font-bold",
        done
          ? "border-green-500 bg-green-50 text-green-500"
          : "border-red-500 bg-red-50 text-red-500",
      )}
    >
      {done ? "完了" : "未完了"}
    </button>
  );
};
