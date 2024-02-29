import { HashIcon, MessagesSquareIcon } from "lucide-react";

export const EmptyChat: React.FC = () => {
  return (
    <div className="grid h-full place-content-center place-items-center gap-2">
      <MessagesSquareIcon size={100} strokeWidth={1.1} />
      <div className="flex gap-1 text-xl font-bold">
        <div className="flex items-center gap-1">
          <HashIcon size={25} className="text-green-500" strokeWidth={3} />
          channel
        </div>
        <div>へようこそ</div>
      </div>
    </div>
  );
};
