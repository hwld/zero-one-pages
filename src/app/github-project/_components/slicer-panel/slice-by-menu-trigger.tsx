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
            <DropdownItem icon={UsersIcon} label="Assigness" />
            <DropdownItem icon={ChevronDownSquareIcon} label="Status" />
            <DropdownItem icon={TagIcon} label="Labels" />
            <DropdownItem icon={BookMarkedIcon} label="Repository" />
            <DropdownItem icon={MilestoneIcon} label="Milestone" />
            <DropdownItem icon={XIcon} label="No slicing" />
          </DropdownItemGroup>
        </DropdownCard>
      </DropdownContent>
    </DropdownProvider>
  );
};
