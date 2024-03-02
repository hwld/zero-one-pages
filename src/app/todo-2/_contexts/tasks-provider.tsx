import { ReactNode, createContext, useContext, useMemo, useState } from "react";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "done" | "todo";
  createdAt: string;
  completedAt: string;
};

export type TasksAction = {
  addTask: (newTask: Pick<Task, "title" | "description">) => void;
  updateTask: (
    data: { id: string } & Partial<
      Pick<Task, "title" | "description" | "status">
    >,
  ) => void;
  deleteTask: (id: string) => void;
};

const TasksDataContext = createContext<Task[] | undefined>(undefined);
const TasksActionContext = createContext<TasksAction | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const action: TasksAction = useMemo(() => {
    return {
      addTask: (newTask) => {
        setTasks((t) => [
          ...t,
          {
            id: crypto.randomUUID(),
            title: newTask.title,
            description: newTask.description,
            status: "todo",
            createdAt: new Date().toLocaleString(),
            completedAt: "",
          },
        ]);
      },

      updateTask: (newTask) => {
        const isCompleted = newTask.status === "done";

        setTasks((tasks) =>
          tasks.map((t) => {
            if (t.id === newTask.id) {
              return {
                ...t,
                title: newTask.title ?? t.title,
                description: newTask.description ?? t.description,
                status: newTask.status ?? t.status,
                completedAt: isCompleted ? new Date().toLocaleString() : "",
              };
            }
            return t;
          }),
        );
      },

      deleteTask: (id) => {
        setTasks((tasks) => tasks.filter((t) => t.id !== id));
      },
    };
  }, []);

  return (
    <TasksDataContext.Provider value={tasks}>
      <TasksActionContext.Provider value={action}>
        {children}
      </TasksActionContext.Provider>
    </TasksDataContext.Provider>
  );
};

export const useAllTasks = (): Task[] => {
  const ctx = useContext(TasksDataContext);
  if (!ctx) {
    throw new Error("TasksProviderが存在しません");
  }
  return ctx;
};

export const usePaginatedTasks = ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}): { tasks: Task[]; totalTasks: number } => {
  const tasks = useAllTasks();

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    tasks: tasks.slice(startIndex, endIndex),
    totalTasks: Math.ceil(tasks.length / limit),
  };
};

export const useTaskAction = (): TasksAction => {
  const ctx = useContext(TasksActionContext);
  if (!ctx) {
    throw new Error("TasksProviderが存在しません");
  }
  return ctx;
};
