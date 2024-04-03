import { ReactNode, useState } from "react";
import { DropdownProvider } from "./dropdown/provider";
import { Tooltip } from "./tooltip";
import { DropdownTrigger } from "./dropdown/trigger";
import { DropdownCard } from "./dropdown/card";
import { DropdownContent } from "./dropdown/content";
import {
  DropdownItem,
  DropdownItemGroup,
  DropdownItemList,
} from "./dropdown/item";
import {
  ArchiveIcon,
  BookOpenIcon,
  CopyIcon,
  MessageSquareIcon,
  RocketIcon,
  SettingsIcon,
  WorkflowIcon,
} from "lucide-react";
import { Divider } from "./divider";

type Props = { children: ReactNode };
export const ProjectMenuTrigger: React.FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownProvider
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      placement="bottom-end"
    >
      <Tooltip label="View more options">
        <DropdownTrigger>{children}</DropdownTrigger>
      </Tooltip>
      <DropdownContent>
        <DropdownCard>
          <DropdownItemList>
            <DropdownItem icon={WorkflowIcon} title="Workflows" />
            <DropdownItem icon={ArchiveIcon} title="Archived items" />
            <DropdownItem icon={SettingsIcon} title="Settings" />
            <DropdownItem icon={CopyIcon} title="Make a copy" />
          </DropdownItemList>
          <Divider />
          <DropdownItemGroup group="GitHub Projects">
            <DropdownItem icon={RocketIcon} title="What's new" />
            <DropdownItem icon={MessageSquareIcon} title="Give feedback" />
            <DropdownItem icon={BookOpenIcon} title="GitHub Docs" />
          </DropdownItemGroup>
        </DropdownCard>
      </DropdownContent>
    </DropdownProvider>
  );
};
