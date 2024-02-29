import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
  CalendarIcon,
  HomeIcon,
  LayoutListIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { MenuItem } from "./menu-item";

export const Menu: React.FC = () => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-neutral-100 ring-neutral-900 ring-offset-2 ring-offset-neutral-100 transition-colors duration-200 hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring">
          <MoreHorizontalIcon size="60%" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[300px] origin-[100%_100%] rounded-lg bg-neutral-900 p-3 transition-all duration-200 data-[state=closed]:animate-popoverExit data-[state=open]:animate-popoverEnter"
          sideOffset={12}
          side="top"
          align="end"
        >
          <MenuItem icon={<HomeIcon />}>今日のタスク</MenuItem>
          <MenuItem icon={<LayoutListIcon />}>過去のタスク</MenuItem>
          <MenuItem icon={<CalendarIcon />}>予定</MenuItem>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
