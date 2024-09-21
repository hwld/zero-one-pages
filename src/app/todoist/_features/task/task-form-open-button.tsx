import { useState } from "react";
import { TaskForm } from "./task-form";
import { PlusIcon } from "lucide-react";

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
      <PlusIcon className="size-4 rounded-full text-rose-400 transition-colors group-hover:bg-rose-600 group-hover:text-stone-100" />
      <div>タスクを追加</div>
    </button>
  );
};
