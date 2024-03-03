import { ReactNode, createContext, useContext, useMemo, useState } from "react";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "done" | "todo";
  createdAt: Date;
  completedAt: Date | undefined;
};

export type Order = "asc" | "desc";
export type SortEntry = {
  field: Extract<keyof Task, "title" | "createdAt" | "completedAt">;
  order: Order;
};

export type TasksData = { tasks: Task[]; sortEntry: SortEntry };

export type TasksAction = {
  addTask: (newTask: Pick<Task, "title" | "description">) => void;
  updateTask: (
    data: { id: string } & Partial<
      Pick<Task, "title" | "description" | "status">
    >,
  ) => void;
  deleteTask: (id: string) => void;
  sort: (entry: SortEntry) => void;
};

const TasksDataContext = createContext<TasksData | undefined>(undefined);
const TasksActionContext = createContext<TasksAction | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sortEntry, setSortEntry] = useState<SortEntry>({
    field: "createdAt",
    order: "desc",
  });

  const sortedTasks = useMemo(() => {
    const { field, order } = sortEntry;

    return [...tasks].sort((a, b) => {
      switch (field) {
        case "title": {
          return a.title.localeCompare(b.title) * (order === "desc" ? -1 : 1);
        }
        case "createdAt":
        case "completedAt": {
          return (
            ((a[field]?.getTime() ?? Number.MAX_VALUE) -
              (b[field]?.getTime() ?? Number.MAX_VALUE)) *
            (order === "desc" ? -1 : 1)
          );
        }
        default: {
          throw new Error(field satisfies never);
        }
      }
    });
  }, [sortEntry, tasks]);

  const data: TasksData = useMemo(() => {
    return { tasks: sortedTasks, sortEntry };
  }, [sortEntry, sortedTasks]);

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
            createdAt: new Date(),
            completedAt: undefined,
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
                completedAt: isCompleted ? new Date() : undefined,
              };
            }
            return t;
          }),
        );
      },

      deleteTask: (id) => {
        setTasks((tasks) => tasks.filter((t) => t.id !== id));
      },

      sort: (entry) => {
        setSortEntry(entry);
      },
    };
  }, []);

  return (
    <TasksDataContext.Provider value={data}>
      <TasksActionContext.Provider value={action}>
        {children}
      </TasksActionContext.Provider>
    </TasksDataContext.Provider>
  );
};

export const useAllTasks = (): TasksData => {
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
  const { tasks } = useAllTasks();

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
