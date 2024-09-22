"use client";

import { useEffect, useRef, type PropsWithChildren } from "react";
import { PiDotsThreeBold } from "@react-icons/all-files/pi/PiDotsThreeBold";
import { PiCalendarBlank } from "@react-icons/all-files/pi/PiCalendarBlank";
import { PiAlarm } from "@react-icons/all-files/pi/PiAlarm";
import { PiFlag } from "@react-icons/all-files/pi/PiFlag";
import type { IconType } from "@react-icons/all-files";
import clsx from "clsx";
import { PiTrayLight } from "@react-icons/all-files/pi/PiTrayLight";
import { PiCaretDown } from "@react-icons/all-files/pi/PiCaretDown";
import { Button } from "../../_components/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  taskFormFieldMap,
  taskFormSchema,
  type TaskFormData,
} from "../../_backend/task/schema";
import { useCreateTask } from "./use-create-task";
import { z } from "zod";

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
  const submitRef = useRef<HTMLButtonElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    trigger,
  } = useForm<TaskFormData>({
    mode: "all",
    resolver: zodResolver(taskFormSchema, {
      errorMap: (issue, ctx) => {
        if (issue.code === z.ZodIssueCode.too_big && issue.type === "string") {
          const field = issue.path[0];

          return {
            message: `${taskFormFieldMap[field]}の文字数制限: ${Number(ctx.data?.length)} / ${issue.maximum}`,
          };
        }

        return { message: ctx.defaultError };
      },
    }),
  });

  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const errorMessages = [errors.title, errors.description]
    .filter((e) => {
      return e?.type !== z.ZodIssueCode.too_small;
    })
    .map((e) => e?.message)
    .filter((m) => m !== undefined);

  const handleClickForm = () => {
    titleInputRef.current?.focus();
  };

  const handleCreateTask = handleSubmit((input: TaskFormData) => {
    createTask.mutate(
      { title: input.title, description: input.description },
      {
        onSuccess: () => {
          onAfterSubmit?.();
        },
      },
    );
  });

  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onCancel();
      return;
    }

    if (e.key === "Enter" && e.metaKey) {
      submitRef.current?.click();
      return;
    }
  };

  useEffect(() => {
    // 初期レンダリングでエラーを表示させる
    trigger();
  }, [trigger]);

  return (
    <div onKeyDown={handleFormKeyDown}>
      <div
        className="grid cursor-pointer grid-rows-[auto_auto] gap-2 p-4"
        onClick={handleClickForm}
      >
        <div className="grid grid-rows-[auto_auto_auto] gap-1">
          <input
            autoFocus
            {...register("title")}
            ref={(e) => {
              register("title").ref(e);
              titleInputRef.current = e;
            }}
            onClick={(e) => e.stopPropagation()}
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
            onClick={(e) => e.stopPropagation()}
          />
          {errorMessages.length > 0 && (
            <p className="text-xs text-red-600">{errorMessages[0]}</p>
          )}
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
          <Button
            ref={submitRef}
            onClick={handleCreateTask}
            disabled={!isValid}
          >
            タスクを追加
          </Button>
        </div>
      </div>
    </div>
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
