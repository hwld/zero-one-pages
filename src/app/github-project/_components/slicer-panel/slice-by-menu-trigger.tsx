import {
  UsersIcon,
  ChevronDownSquareIcon,
  TagIcon,
  BookMarkedIcon,
  MilestoneIcon,
  XIcon,
} from "lucide-react";
import { ReactNode, useState } from "react";
import { DropdownCard } from "../dropdown/card";
import { DropdownContent } from "../dropdown/content";
import { DropdownItemGroup, DropdownItem } from "../dropdown/item";
import { DropdownProvider } from "../dropdown/provider";
import { DropdownTrigger } from "../dropdown/trigger";

type Props = { children: ReactNode };
export const SliceByMenuTrigger: React.FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownProvider isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger>{children}</DropdownTrigger>
      <DropdownContent>
        <DropdownCard>
          <DropdownItemGroup group="Slice by">
            <DropdownItem icon={UsersIcon} title="Assigness" />
            <DropdownItem icon={ChevronDownSquareIcon} title="Status" />
            <DropdownItem icon={TagIcon} title="Labels" />
            <DropdownItem icon={BookMarkedIcon} title="Repository" />
            <DropdownItem icon={MilestoneIcon} title="Milestone" />
            <DropdownItem icon={XIcon} title="No slicing" />
          </DropdownItemGroup>
        </DropdownCard>
      </DropdownContent>
    </DropdownProvider>
  );
};
