import { CatIcon } from "lucide-react";
import { ChannelLink } from "./channel-link";
import { UserPanel } from "./user-panel/user-panel";

export const SideBar: React.FC = () => {
  return (
    <div className="grid grid-rows-[40px_1fr_min-content] bg-neutral-900">
      <div className="flex items-center gap-1 bg-white/10 p-3 text-sm">
        <CatIcon size={18} strokeWidth={1.5} />
        Cat server
      </div>
      <div className="flex flex-col items-start gap-1 p-3">
        <ChannelLink active />
        <ChannelLink />
        <ChannelLink />
        <ChannelLink />
        <ChannelLink />
        <ChannelLink />
      </div>
      <UserPanel />
    </div>
  );
};
