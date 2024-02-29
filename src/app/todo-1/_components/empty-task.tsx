import { BoxSelectIcon } from "lucide-react";

export const EmptyTask: React.FC = () => {
  return (
    <div className="grid w-full place-items-center gap-1 rounded-lg border border-neutral-300 bg-neutral-100 px-5 py-20">
      <BoxSelectIcon size={80} />
      <div className="text-center">
        <div className="font-bold">タスクが存在しません</div>
        <div>`Ctrl`+`k`または、`Cmd`+`k`を入力し、タスクを追加できます</div>
      </div>
    </div>
  );
};
