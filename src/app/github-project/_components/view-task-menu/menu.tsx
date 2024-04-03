import { forwardRef } from "react";
import { ViewTask } from "../../_mocks/view/api";
import {
  CircleDotIcon,
  CopyIcon,
  ArrowUpToLine,
  ArrowDownToLineIcon,
  MoveHorizontalIcon,
  ChevronRightIcon,
  ArchiveIcon,
  TrashIcon,
} from "lucide-react";
import { useDeleteTask } from "../../_queries/useDeleteTask";
import { Divider } from "../divider";
import { DropdownCard } from "../dropdown/card";
import { DropdownItemList, DropdownItem } from "../dropdown/item";

type Props = {
  task: ViewTask;
  onOpenMoveToColumnMenu: () => void;
  onMoveTop: (() => void) | undefined;
  onMoveBottom: (() => void) | undefined;
};

export const ViewTaskCardMenu = forwardRef<HTMLDivElement, Props>(
  function ViewTaskCardMenu(
    { task, onOpenMoveToColumnMenu, onMoveTop, onMoveBottom },
    ref,
  ) {
    const deleteTaskMutation = useDeleteTask();

    const handleDeleteTask = () => {
      deleteTaskMutation.mutate(task.id);
    };

    return (
      <DropdownCard ref={ref}>
        <DropdownItemList>
          <DropdownItem icon={CircleDotIcon} title="Convert to issue" />
          <DropdownItem icon={CopyIcon} title="Copy link in project" />
        </DropdownItemList>
        <Divider />
        <DropdownItemList>
          <DropdownItem
            icon={ArrowUpToLine}
            title="Move to top"
            disabled={onMoveTop === undefined}
            onClick={onMoveTop}
          />
          <DropdownItem
            icon={ArrowDownToLineIcon}
            title="Move to bottom"
            disabled={onMoveBottom === undefined}
            onClick={onMoveBottom}
          />
          <DropdownItem
            icon={MoveHorizontalIcon}
            leftIcon={ChevronRightIcon}
            title="Move to column"
            onClick={onOpenMoveToColumnMenu}
          />
        </DropdownItemList>
        <Divider />
        <DropdownItemList>
          <DropdownItem icon={ArchiveIcon} title="Archive" />
          {/* TODO: confirm dialog */}
          <DropdownItem
            icon={TrashIcon}
            title="Delete from project"
            red
            onClick={handleDeleteTask}
          />
        </DropdownItemList>
      </DropdownCard>
    );
  },
);
