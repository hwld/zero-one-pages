"use client";

import { AppLayout } from "../_components/app-layout/app-layout";
import { PiChatLight } from "@react-icons/all-files/pi/PiChatLight";
import { PiDotsThreeOutlineLight } from "@react-icons/all-files/pi/PiDotsThreeOutlineLight";
import { PiSlidersHorizontalLight } from "@react-icons/all-files/pi/PiSlidersHorizontalLight";
import { IconButton } from "../_components/icon-button";
import { Tooltip, TooltipDelayGroup } from "../_components/tooltip";
import { useInbox } from "../_features/inbox/use-inbox";
import { AppLayoutTasksContent } from "../_components/app-layout/tasks-content";

const InboxPage: React.FC = () => {
  const { data: inbox } = useInbox();

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
      {inbox ? (
        <AppLayoutTasksContent
          tasks={inbox.tasks}
          taskboxId={inbox.taskboxId}
        />
      ) : null}
    </AppLayout>
  );
};

export default InboxPage;
