"use client";

import type { PropsWithChildren } from "react";
import { PiDotsThreeBold } from "@react-icons/all-files/pi/PiDotsThreeBold";
import { PiCalendarBlank } from "@react-icons/all-files/pi/PiCalendarBlank";
import { PiAlarm } from "@react-icons/all-files/pi/PiAlarm";
import { PiFlag } from "@react-icons/all-files/pi/PiFlag";
import type { IconType } from "@react-icons/all-files";
import clsx from "clsx";
import { PiTrayLight } from "@react-icons/all-files/pi/PiTrayLight";
import { PiCaretDown } from "@react-icons/all-files/pi/PiCaretDown";
import { Button } from "../../_components/button";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taskFormSchema, type TaskFormData } from "../../_backend/task/schema";
import { useCreateTask } from "./use-create-task";

type Props = {
  size?: "md" | "sm";
  onCancel: () => void;
  onAfterSubmit?: () => void;
};

export const TaskForm: React.FC<Props> = ({
  size = "md",
  onCancel,
  onAfterSubmit,
}) => {
  const createTask = useCreateTask();
  const { register, handleSubmit } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
  });

  const handleCreateTask: SubmitHandler<TaskFormData> = (input) => {
    createTask.mutate(
      { title: input.title, description: input.description },
      {
        onSuccess: () => {
          onAfterSubmit?.();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(handleCreateTask)}>
      <div className="grid grid-rows-[auto_auto] gap-4 p-4">
        <div className="grid grid-rows-[auto_auto] gap-1">
          <input
            autoFocus
            {...register("title")}
            placeholder="タスク名"
            className={clsx(
              "border-none bg-transparent font-bold tracking-wide text-stone-700 outline-none placeholder:font-bold placeholder:text-stone-400",
              { md: "text-lg", sm: "" }[size],
            )}
          />
          <textarea
            {...register("description")}
            placeholder="説明"
            className="resize-none bg-transparent text-stone-700 outline-none placeholder:text-stone-400"
            rows={3}
          />
        </div>
        <div className="flex gap-2">
          <Select icon={PiCalendarBlank}>予定日</Select>
          <Select icon={PiFlag}>優先度</Select>
          <Select icon={PiAlarm}>リマインダー</Select>
          <button
            className={clsx(buttonClass, "grid size-7 place-items-center")}
          >
            <PiDotsThreeBold className="size-5 text-stone-900" />
          </button>
        </div>
      </div>
      <hr />
      <div className="flex items-center justify-between gap-2 p-2">
        <button className="group grid h-8 grid-cols-[auto_1fr_auto] items-center gap-1 rounded px-2 transition-colors hover:bg-stone-500/10">
          <PiTrayLight className="size-4" />
          <p className="font-medium text-stone-500 group-hover:text-stone-900">
            インボックス
          </p>
          <PiCaretDown className="size-4" />
        </button>
        <div className="flex items-center gap-2">
          <Button color="secondary" onClick={onCancel}>
            キャンセル
          </Button>
          <Button type="submit">タスクを追加</Button>
        </div>
      </div>
    </form>
  );
};

const buttonClass =
  "border border-stone-300 text-stone-500 hover:bg-stone-500/10 rounded transition-colors";

const Select: React.FC<PropsWithChildren & { icon: IconType }> = ({
  children,
  icon: Icon,
}) => {
  return (
    <button
      className={clsx(
        "group grid h-7 grid-cols-[auto_1fr] items-center gap-1 px-2 text-xs",
        buttonClass,
      )}
    >
      <Icon className="size-4 group-hover:text-stone-900" />
      {children}
    </button>
  );
};
