import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { paginate } from "../_lib/utils";
import { z } from "zod";

const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  status: z.union([z.literal("done"), z.literal("todo")]),
  createdAt: z.coerce.date(),
  completedAt: z.union([z.coerce.date(), z.undefined()]),
});

export type Task = z.infer<typeof taskSchema>;

export type Order = "asc" | "desc";
export type SortEntry = {
  field: Extract<keyof Task, "title" | "createdAt" | "completedAt">;
  order: Order;
};

export type Filter =
  | { field: "status"; value: "todo" }
  | { field: "status"; value: "done" };

export type TasksData = {
  paginatedTasks: Task[];
  totalTasks: number;
  page: number;
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

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
};

const TasksDataContext = createContext<TasksData | undefined>(undefined);
const TasksActionContext = createContext<TasksAction | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
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

  const paginatedTasks = useMemo(() => {
    return paginate(tasks, { page, limit });
  }, [limit, page, tasks]);

  const data: TasksData = useMemo(() => {
    return {
      paginatedTasks,
      page,
      totalTasks: Math.ceil(tasks.length / limit),
      sortEntry,
      filters,
      isFiltered: (filter) => {
        return !!filters.find(
          (f) => f.field === filter.field && f.value === filter.value,
        );
      },
    };
  }, [filters, limit, page, paginatedTasks, sortEntry, tasks.length]);

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
        if (paginatedTasks.length === 1) {
          setPage((p) => {
            if (p > 1) {
              return p - 1;
            }
            return p;
          });
        }
        setAllTasks((tasks) => tasks.filter((t) => t.id !== id));
      },

      search: (text) => {
        setSearchText(text);
        setPage(1);
      },

      sort: (entry) => {
        setSortEntry(entry);
        setPage(1);
      },

      addFilter: (filter) => {
        setFilters((f) => [...f, filter]);
        setPage(1);
      },

      removeFilter: (filter) => {
        setFilters((f) =>
          f.filter(
            (f) => !(f.field === filter.field && f.value === filter.value),
          ),
        );
        setPage(1);
      },

      removeAllFilter: () => {
        setFilters([]);
        setPage(1);
      },

      setPage: (page) => {
        setPage(page);
      },

      setLimit: (limit) => {
        setLimit(limit);
        setPage(1);
      },
    };
  }, [paginatedTasks.length]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const res = await fetch("./initial-data.json");
      const data = await res.json();
      setAllTasks(data.map(taskSchema.parse));
    };

    fetchInitialData();
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

export const useTaskAction = (): TasksAction => {
  const ctx = useContext(TasksActionContext);
  if (!ctx) {
    throw new Error("TasksProviderが存在しません");
  }
  return ctx;
};
