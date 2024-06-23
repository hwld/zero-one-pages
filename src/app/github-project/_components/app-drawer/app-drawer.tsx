import { useState } from "react";
import { Drawer } from "../drawer/drawer";
import {
  CircleDotIcon,
  ComputerIcon,
  GiftIcon,
  GitPullRequestIcon,
  HomeIcon,
  MenuIcon,
  MessagesSquareIcon,
  PanelsTopLeftIcon,
  SearchIcon,
  TelescopeIcon,
  XIcon,
} from "lucide-react";
import { Logo } from "../logo";
import { DrawerItem } from "../drawer/item";
import { Divider } from "../divider";
import { HeaderButton } from "../app-header/button";
import { Avatar } from "../avatar";
import { IconButton } from "../icon-button";

export const AppDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      position="left"
      trigger={<HeaderButton icon={MenuIcon} />}
    >
      <div className="flex w-full items-center justify-between px-4 pb-2 pt-4">
        <Logo />
        <IconButton icon={XIcon} onClick={() => setIsOpen(false)} />
      </div>
      <div className="min-w-0 grow space-y-2 overflow-auto px-4 pt-2">
        <div>
          <DrawerItem icon={HomeIcon} title="Home" />
          <DrawerItem icon={CircleDotIcon} title="Issues" />
          <DrawerItem icon={GitPullRequestIcon} title="Pull requests" />
          <DrawerItem icon={PanelsTopLeftIcon} title="Projects" />
          <DrawerItem icon={MessagesSquareIcon} title="Discussions" />
          <DrawerItem icon={ComputerIcon} title="Codespaces" />
        </div>
        <Divider />
        <div>
          <DrawerItem icon={TelescopeIcon} title="Explore" />
          <DrawerItem icon={GiftIcon} title="Marketplace" />
        </div>
        <Divider />
        <div>
          <div className="flex items-center justify-between text-neutral-400">
            <div className="p-2 text-xs font-bold">Repositories</div>
            <IconButton icon={SearchIcon} />
          </div>
          <div>
            <DrawerItem icon={Avatar} title="hwld/aluep" />
            <DrawerItem icon={Avatar} title="hwld/evodo-openapi" />
            <DrawerItem icon={Avatar} title="hwld/evodo-axum" />
            <DrawerItem icon={Avatar} title="hwld/zero-one-ui" />
            <DrawerItem icon={Avatar} title="hwld/evodo-graphql" />
            <button className="flex h-8 w-full items-center rounded-md px-2 text-xs text-neutral-400 transition-colors hover:bg-white/15">
              Show more
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
