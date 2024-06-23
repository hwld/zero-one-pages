import { Command } from "cmdk";
import { TaskStatus } from "../../../_mocks/task-status/store";
import { ViewColumn } from "../../../_mocks/view/api";
import { SelectionMenu } from "../../selection-menu/menu";
import { forwardRef } from "react";
import { TaskStatusSelectionMenuItem } from "./item";

type Props = {
  columns: ViewColumn[];
  status: TaskStatus;
  onBack?: () => void;
  onClose: () => void;
  onSelect: (statusId: string) => void;
  placeHolder?: string;
};

export const TaskStatusSelectionMenu = forwardRef<HTMLDivElement, Props>(
  function TaskStatusSelectionMenu(
    { columns, status, onBack, onClose, onSelect, placeHolder = "Status..." },
    ref,
  ) {
    return (
      <SelectionMenu ref={ref} onBack={onBack} placeholder={placeHolder}>
        {columns.map((column) => {
          return (
            <Command.Item
              asChild
              key={column.statusId}
              onSelect={() => {
                onSelect(column.status.id);
                onClose();
              }}
            >
              <TaskStatusSelectionMenuItem
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
