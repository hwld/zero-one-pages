import { BellIcon, SettingsIcon, UserIcon } from "lucide-react";
import { UserPanelButton } from "./button";
import { SettingsDialog } from "../../settings-dialog/settings-dialog";
import { useState } from "react";

export const UserPanel: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex justify-between gap-2 bg-white/10 p-3">
      <div className="grid size-[30px] shrink-0 place-items-center rounded-full border border-neutral-400 bg-neutral-700">
        <UserIcon size={20} className="text-green-500" />
      </div>
      <div className="w-full text-sm">
        <div>username</div>
        <div className="text-xs">status</div>
      </div>
      <div className="flex gap-1">
        <UserPanelButton icon={BellIcon} />
        <UserPanelButton
          icon={SettingsIcon}
          onClick={() => setIsSettingsOpen(true)}
        />
        <SettingsDialog
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
        />
      </div>
    </div>
  );
};
