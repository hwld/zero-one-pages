import { TaskForm } from "../_features/task/task-form";

const InboxPage: React.FC = () => {
  return (
    <div>
      <div className="w-[800px] rounded-lg border">
        <TaskForm size="sm" />
      </div>
    </div>
  );
};

export default InboxPage;
