"use client";

import { NextPage } from "next";
import { Card } from "../_components/card";
import { ReactNode } from "react";
import {
  IconCheckbox,
  IconClockCheck,
  IconClockHour5,
} from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useTasksData } from "../_contexts/tasks-provider";
import { z } from "zod";

const TaskDetailPage: NextPage = () => {
  const { getTask } = useTasksData();
  const searchParams = useSearchParams();
  const id = z.string().parse(searchParams.get("id"));
  const task = getTask(id);

  return (
    <>
      <h1 className="text-sm">home / detail</h1>
      <div className="grid grow grid-cols-[1fr_300px] gap-4">
        <Card>
          <div className="flex h-full flex-col gap-4">
            <h2 className="text-xl font-bold">{task?.title}</h2>
            <div className="grow">{task?.description}</div>
          </div>
        </Card>
        <Card>
          <div className="flex flex-col gap-4">
            <Row icon={IconCheckbox} title="状況" value={task?.status} />
            <Row
              icon={IconClockHour5}
              title="作成日"
              value={task?.createdAt.toLocaleString()}
            />
            <Row
              icon={IconClockCheck}
              title="完了日"
              value={task?.completedAt?.toLocaleString()}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

const Row: React.FC<{
  icon: React.FC<{ className?: string; size?: number }>;
  title: string;
  value: ReactNode;
}> = ({ icon: Icon, title, value }) => {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex w-[100px] items-center gap-1 text-sm text-zinc-400">
        <Icon size={18} />
        {title}
      </div>
      <div className="ml-2" suppressHydrationWarning>
        {value}
      </div>
    </div>
  );
};

export default TaskDetailPage;
