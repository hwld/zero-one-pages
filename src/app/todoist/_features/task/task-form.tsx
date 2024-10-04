"use client";

import { useEffect, useRef, type PropsWithChildren } from "react";
import { PiDotsThreeBold } from "@react-icons/all-files/pi/PiDotsThreeBold";
import { PiCalendarBlank } from "@react-icons/all-files/pi/PiCalendarBlank";
import { PiAlarm } from "@react-icons/all-files/pi/PiAlarm";
import { PiFlag } from "@react-icons/all-files/pi/PiFlag";
import type { IconType } from "@react-icons/all-files";
import clsx from "clsx";
import { PiTrayLight } from "@react-icons/all-files/pi/PiTrayLight";
import { Button } from "../../_components/button";
import { type TaskFormData } from "../../_backend/task/schema";
import { PiCaretDownLight } from "@react-icons/all-files/pi/PiCaretDownLight";
import { useTaskForm } from "./use-task-form";

type Props = {
  size?: "md" | "sm";
  defaultValues?: TaskFormData;
  onCancel: () => void;
  onSubmit: (input: TaskFormData) => void;
  submitText: string;
  isSubmitting: boolean;
};

export const TaskForm: React.FC<Props> = ({
  size = "md",
  defaultValues = { title: "", description: "" },
  onCancel,
  onSubmit,
  submitText,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { isValid, errorMessagesWithoutTooSmall },
    trigger,
    submitRef,
    handleFormKeyDown,
  } = useTaskForm({ defaultValues, onCancel });

  const titleInputRef = useRef<HTMLInputElement | null>(null);

  const handleClickForm = () => {
    titleInputRef.current?.focus();
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
          {errorMessagesWithoutTooSmall.length > 0 && (
            <p className="text-xs text-red-600">
              {errorMessagesWithoutTooSmall[0]}
            </p>
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
      <div
        className={clsx(
          "flex items-center justify-between gap-2",
          { sm: "p-2", md: "p-4" }[size],
        )}
      >
        <Button
          color="transparent"
          leftIcon={PiTrayLight}
          rightIcon={PiCaretDownLight}
        >
          インボックス
        </Button>
        <div className="flex items-center gap-2">
          <Button color="secondary" onClick={onCancel}>
            キャンセル
          </Button>
          <Button
            ref={submitRef}
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
            loading={isSubmitting}
          >
            {submitText}
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
