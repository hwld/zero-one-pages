import {
  IconCalendar,
  IconCircleCheck,
  IconHome,
  IconListDetails,
} from "@tabler/icons-react";
import { SidebarItem } from "./item";

export const Sidebar: React.FC = () => {
  return (
    <div className="flex w-[200px] flex-col gap-4">
      <div className="flex items-center gap-1 whitespace-nowrap text-sm font-bold">
        <IconCircleCheck size={20} />
        <p>evodo</p>
      </div>
      <div className="flex flex-col gap-1">
        <SidebarItem icon={IconHome} label="今日のタスク" active />
        <SidebarItem icon={IconListDetails} label="過去のタスク" />
        <SidebarItem icon={IconCalendar} label="予定" />
      </div>
    </div>
  );
};
