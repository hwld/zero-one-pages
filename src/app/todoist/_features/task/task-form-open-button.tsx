import { useState } from "react";
import { TaskForm } from "./task-form";
import { PiPlusBold } from "@react-icons/all-files/pi/PiPlusBold";

type Props = {};

export const TaskFormOpenButton: React.FC<Props> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formKey, setFormKey] = useState(crypto.randomUUID());

  if (isOpen) {
    return (
      <div className="rounded-lg border border-stone-300">
        <TaskForm
          key={formKey}
          size="sm"
          onCancel={() => setIsOpen(false)}
          onAfterSubmit={() => setFormKey(crypto.randomUUID())}
        />
      </div>
    );
  }

  return (
    <button
      className="group grid h-8 grid-cols-[auto_1fr] items-center gap-1 rounded px-2 text-start text-stone-500 transition-colors hover:bg-rose-50 hover:text-rose-600"
      onClick={() => setIsOpen(true)}
    >
      <div className="grid size-5 place-items-center rounded-full transition-colors group-hover:bg-rose-600">
        <PiPlusBold className="size-4  text-rose-500 transition-colors group-hover:text-stone-100" />
      </div>
      <div>タスクを追加</div>
    </button>
  );
};
