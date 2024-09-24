import type { Task } from "../../../_backend/task/model";
import type { TaskFormData } from "../../../_backend/task/schema";
import { TaskForm } from "../task-form";
import { useUpdateTask } from "../use-update-task";

type Props = {
  task: Task;
  onClose: () => void;
};

export const TaskUpdateForm: React.FC<Props> = ({ task, onClose }) => {
  const updateTask = useUpdateTask();

  const handleUpdate = (input: TaskFormData) => {
    updateTask.mutate(
      { id: task.id, ...input },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <div className="rounded-lg border border-stone-300">
      <TaskForm
        size="sm"
        defaultValues={{ title: task.title, description: task.description }}
        submitText="保存"
        onSubmit={handleUpdate}
        isSubmitting={updateTask.isPending}
        onCancel={onClose}
      />
    </div>
  );
};
