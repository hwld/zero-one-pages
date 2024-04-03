import { Command } from "cmdk";
import { TaskStatus } from "../../../_mocks/task-status/store";
import { ViewColumn } from "../../../_mocks/view/api";
import { SelectionMenu } from "../../selection-menu/menu";
import { forwardRef } from "react";
import { MoveToColumnItem } from "./item";

type Props = {
  columns: ViewColumn[];
  status: TaskStatus;
  onBack: () => void;
  onClose: () => void;
  onMoveToColumn: (statusId: string) => void;
};
export const MoveToColumnMenu = forwardRef<HTMLDivElement, Props>(
  function MoveToColumnMenu(
    { columns, status, onBack, onClose: onClose, onMoveToColumn },
    ref,
  ) {
    return (
      <SelectionMenu ref={ref} onBack={onBack} placeholder="Column...">
        {columns.map((column) => {
          return (
            <Command.Item
              asChild
              key={column.statusId}
              onSelect={() => {
                onMoveToColumn(column.status.id);
                onClose();
              }}
            >
              <MoveToColumnItem
                status={column.status}
                active={column.status.name === status.name}
              />
            </Command.Item>
          );
        })}
      </SelectionMenu>
    );
  },
);
