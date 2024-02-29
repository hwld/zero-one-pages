import {
  CalendarIcon,
  CircleIcon,
  HomeIcon,
  LayoutListIcon,
} from "lucide-react";
import { SideBarItem } from "./sidebar-item";

export const SideBar: React.FC = () => {
  return (
    <div className="hidden w-[300px]  flex-col gap-5 rounded-e-md bg-neutral-800 p-5 lg:flex">
      <div className="flex items-center gap-2 px-3 font-bold text-neutral-100">
        <CircleIcon strokeWidth={3} />
        TODODO
      </div>
      <div className="h-[1px] w-full bg-neutral-600" />
      <div className="flex flex-col items-start gap-2">
        <SideBarItem active icon={<HomeIcon />}>
          今日のタスク
        </SideBarItem>
        <SideBarItem icon={<LayoutListIcon />}>過去のタスク</SideBarItem>
        <SideBarItem icon={<CalendarIcon />}>予定</SideBarItem>
      </div>
    </div>
  );
};
