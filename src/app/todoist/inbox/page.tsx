"use client";

import { TaskFormOpenButton } from "../_features/task/task-form-open-button";
import { useTasks } from "../_features/task/use-tasks";
import { AppLayout } from "../_components/app-layout";
import { PiChatLight } from "@react-icons/all-files/pi/PiChatLight";
import { PiDotsThreeOutlineLight } from "@react-icons/all-files/pi/PiDotsThreeOutlineLight";
import { PiSlidersHorizontalLight } from "@react-icons/all-files/pi/PiSlidersHorizontalLight";
import { IconButton } from "../_components/icon-button";
import { Tooltip, TooltipDelayGroup } from "../_components/tooltip";
import { TaskListItem } from "../_features/task/task-list-item/task-list-item";

const InboxPage: React.FC = () => {
  const { data: tasks = [] } = useTasks();

  const doneTasks = tasks.filter((t) => t.done);
  const undoneTasks = tasks.filter((t) => !t.done);

  return (
    <AppLayout
      title="インボックス"
      rightHeader={
        <div className="flex items-center gap-1">
          <TooltipDelayGroup>
            <Tooltip label="オプションメニューを表示">
              <IconButton icon={PiSlidersHorizontalLight} label="表示" />
            </Tooltip>
            <Tooltip label="コメント">
              <IconButton icon={PiChatLight} />
            </Tooltip>
            <Tooltip label="その他のアクション" keys={["W"]}>
              <IconButton icon={PiDotsThreeOutlineLight} />
            </Tooltip>
          </TooltipDelayGroup>
        </div>
      }
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          {undoneTasks.map((t) => {
            return <TaskListItem key={t.id} task={t} />;
          })}
        </div>
        <TaskFormOpenButton />
        <div className="flex flex-col gap-2">
          {doneTasks.map((t) => {
            return <TaskListItem key={t.id} task={t} />;
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default InboxPage;
