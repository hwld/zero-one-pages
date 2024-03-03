import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { initialTasks } from "./data";

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

export type Filter =
  | { field: "status"; value: "todo" }
  | { field: "status"; value: "done" };

export type TasksData = {
  tasks: Task[];
  sortEntry: SortEntry;
  filters: Filter[];
  isFiltered: (filter: Filter) => boolean;
};

export type TasksAction = {
  addTask: (newTask: Pick<Task, "title" | "description">) => void;
  updateTask: (
    data: { id: string } & Partial<
      Pick<Task, "title" | "description" | "status">
    >,
  ) => void;
  deleteTask: (id: string) => void;

  search: (text: string) => void;

  sort: (entry: SortEntry) => void;

  addFilter: (filter: Filter) => void;
  removeFilter: (filter: Filter) => void;
  removeAllFilter: () => void;
};

const TasksDataContext = createContext<TasksData | undefined>(undefined);
const TasksActionContext = createContext<TasksAction | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [allTasks, setAllTasks] = useState<Task[]>(initialTasks);
  const [searchText, setSearchText] = useState("");
  const [sortEntry, setSortEntry] = useState<SortEntry>({
    field: "createdAt",
    order: "desc",
  });
  const [filters, setFilters] = useState<Filter[]>([]);

  const tasks = useMemo(() => {
    const { field, order } = sortEntry;

    const filteredTasks = allTasks.filter((t) => {
      if (filters.length === 0) {
        return true;
      }

      return filters.some((filter) => t[filter.field] === filter.value);
    });

    const sortedTasks = filteredTasks.sort((a, b) => {
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

    const searchedTasks = sortedTasks.filter((task) => {
      return (
        task.title.includes(searchText) || task.description.includes(searchText)
      );
    });

    return searchedTasks;
  }, [sortEntry, allTasks, filters, searchText]);

  const data: TasksData = useMemo(() => {
    return {
      tasks,
      sortEntry,
      filters,
      isFiltered: (filter) => {
        return !!filters.find(
          (f) => f.field === filter.field && f.value === filter.value,
        );
      },
    };
  }, [filters, sortEntry, tasks]);

  const action: TasksAction = useMemo(() => {
    return {
      addTask: (newTask) => {
        setAllTasks((t) => [
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

        setAllTasks((tasks) =>
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
        setAllTasks((tasks) => tasks.filter((t) => t.id !== id));
      },

      search: (text) => {
        setSearchText(text);
      },

      sort: (entry) => {
        setSortEntry(entry);
      },

      addFilter: (filter) => {
        setFilters((f) => [...f, filter]);
      },

      removeFilter: (filter) => {
        setFilters((f) =>
          f.filter(
            (f) => !(f.field === filter.field && f.value === filter.value),
          ),
        );
      },

      removeAllFilter: () => {
        setFilters([]);
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

export const useTasksData = (): TasksData => {
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
  const { tasks } = useTasksData();

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
