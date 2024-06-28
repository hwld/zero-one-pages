import { useState } from "react";
import { Task } from "../../_backend/task/store";
import { Button } from "../button";
import { TaskCommentForm } from "./task-comment-form";

type Props = { task: Task };

export const TaskCommentSection: React.FC<Props> = ({ task }) => {
  const [isEditable, setIsEditable] = useState(false);

  const enableEditing = () => {
    setIsEditable(true);
  };

  const disableEditing = () => {
    setIsEditable(false);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      {isEditable ? (
        <TaskCommentForm
          task={task}
          onCancel={disableEditing}
          onAfterSubmit={disableEditing}
        />
      ) : (
        <>
          <div className="w-full text-end">
            <Button color="default" onClick={enableEditing}>
              Edit
            </Button>
          </div>
          <div className="whitespace-pre text-sm">{task.comment}</div>
        </>
      )}
    </div>
  );
};
