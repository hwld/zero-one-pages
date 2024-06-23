import { ReactNode, useState } from "react";
import { DropdownProvider } from "../dropdown/provider";
import { Tooltip } from "../tooltip";
import { DropdownCard } from "../dropdown/card";
import { DropdownItem, DropdownItemList } from "../dropdown/item";
import {
  BookDownIcon,
  BookMarkedIcon,
  BuildingIcon,
  CodeIcon,
  ComputerIcon,
  KanbanSquareIcon,
} from "lucide-react";
import { Divider } from "../divider";
import { DropdownContent } from "../dropdown/content";
import { DropdownTrigger } from "../dropdown/trigger";

type Props = { children: ReactNode };

export const CreateNewMenuTrigger: React.FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownProvider isOpen={isOpen} onOpenChange={setIsOpen}>
      <Tooltip label="Create new...">
        <DropdownTrigger>{children}</DropdownTrigger>
      </Tooltip>
      <DropdownContent>
        <DropdownCard>
          <DropdownItemList>
            <DropdownItem icon={BookMarkedIcon} label="New repository" />
            <DropdownItem icon={BookDownIcon} label="Import repository" />
          </DropdownItemList>
          <Divider />
          <DropdownItemList>
            <DropdownItem icon={ComputerIcon} label="New codespace" />
            <DropdownItem icon={CodeIcon} label="New gist" />
          </DropdownItemList>
          <Divider />
          <DropdownItemList>
            <DropdownItem icon={BuildingIcon} label="New organization" />
            <DropdownItem icon={KanbanSquareIcon} label="New project" />
          </DropdownItemList>
        </DropdownCard>
      </DropdownContent>
    </DropdownProvider>
  );
};
