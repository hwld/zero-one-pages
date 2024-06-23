import { useState } from "react";
import { Drawer } from "../drawer/drawer";
import { Avatar } from "../avatar";
import { DrawerItem } from "../drawer/item";
import {
  BookMarkedIcon,
  BuildingIcon,
  CodeSquareIcon,
  ComputerIcon,
  FlaskConicalIcon,
  GlobeIcon,
  HeartIcon,
  KanbanSquareIcon,
  MessagesSquareIcon,
  SettingsIcon,
  SmileIcon,
  StarIcon,
  UploadIcon,
  UserIcon,
  UserPlusIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { Divider } from "../divider";
import { IconButton } from "../icon-button";

export const UserDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      position="right"
      trigger={
        <button>
          <Avatar />
        </button>
      }
    >
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Avatar />
            <div>
              <div className="text-sm font-bold">hwld</div>
              <div className="text-sm text-neutral-400">hwld</div>
            </div>
          </div>
          <div className="self-start">
            <IconButton icon={XIcon} onClick={() => setIsOpen(false)} />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <DrawerItem icon={SmileIcon} title="Set status" />
          <Divider />
          <div>
            <DrawerItem icon={UserIcon} title="Your profile" />
            <DrawerItem icon={UserPlusIcon} title="Add account" />
          </div>
          <Divider />
          <div>
            <DrawerItem icon={BookMarkedIcon} title="Your repositories" />
            <DrawerItem icon={KanbanSquareIcon} title="Your projects" />
            <DrawerItem icon={ComputerIcon} title="Your Copilot" />
            <DrawerItem icon={BuildingIcon} title="Your organizations" />
            <DrawerItem icon={GlobeIcon} title="Your enterprises" />
            <DrawerItem icon={StarIcon} title="Your stars" />
            <DrawerItem icon={HeartIcon} title="Your sponsors" />
            <DrawerItem icon={CodeSquareIcon} title="Your gists" />
          </div>
          <Divider />
          <div>
            <DrawerItem icon={UploadIcon} title="Upgrade" />
            <DrawerItem
              icon={GlobeIcon}
              title="Try Enterprise"
              left={
                <span className="flex h-5 items-center rounded-full border border-neutral-400 px-2 text-xs">
                  Free
                </span>
              }
            />
            <DrawerItem icon={FlaskConicalIcon} title="Feature preview" />
            <DrawerItem icon={SettingsIcon} title="Settings" />
          </div>
          <Divider />
          <div>
            <DrawerItem icon={UsersIcon} title="GitHub Support" />
            <DrawerItem icon={MessagesSquareIcon} title="GitHub Community" />
          </div>
          <Divider />
          <div>
            <DrawerItem title="Sign out" />
          </div>
        </div>
      </div>
    </Drawer>
  );
};
