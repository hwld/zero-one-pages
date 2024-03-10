import {
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { paginate } from "../_lib/utils";
import { initialTasks } from "../_lib/initial-data";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: "done" | "todo";
  createdAt: Date;
  completedAt?: Date | undefined;
};

export type Order = "asc" | "desc";
export type SortEntry = {
  field: Extract<keyof Task, "title" | "createdAt" | "completedAt">;
  order: Order;
};

export type FieldFilter =
  | { type: "field"; field: "status"; value: "todo" }
  | { type: "field"; field: "status"; value: "done" };

export type PredicateFilter = {
  type: "predicate";
  predicate: (task: Task, context: { selectedTaskIds: string[] }) => boolean;
};

export type Filter = { id: string; group: "status" | "selection" } & (
  | FieldFilter
  | PredicateFilter
);

export type TasksData = {
  paginatedTasks: Task[];
  selectedTaskIds: string[];
  totalTasks: number;
  page: number;
  sortEntry: SortEntry;
  filters: Filter[];
  scrollTargetRef: RefObject<HTMLDivElement>;
  getTask: (id: string) => Task | undefined;
};

export type TasksAction = {
  addTask: (newTask: Pick<Task, "title" | "description">) => void;
  updateTask: (
    data: { id: string } & Partial<
      Pick<Task, "title" | "description" | "status">
    >,
  ) => void;
  updateTasksStatus: (ids: string[], status: Task["status"]) => void;
  deleteTask: (id: string) => void;

  search: (text: string) => void;

  sort: (entry: SortEntry) => void;

  addFilter: (filter: Filter) => void;
  removeFilter: (filterId: string) => void;
  removeAllFilter: () => void;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;

  toggleTaskSelection: (id: string) => void;
  selectAllTasksOnPage: () => void;
  unselectAllTasksOnPage: () => void;
  unselectAllTasks: () => void;
};

const TasksDataContext = createContext<TasksData | undefined>(undefined);
const TasksActionContext = createContext<TasksAction | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [allTasks, setAllTasks] = useState<Task[]>(initialTasks);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  // これらの情報はquery paramsで持った方が良いが、UIを作ることが目的なので・・・
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);
  const [searchText, setSearchText] = useState("");
  const [sortEntry, setSortEntry] = useState<SortEntry>({
    field: "createdAt",
    order: "desc",
  });
  const [filters, setFilters] = useState<Filter[]>([]);

  const tasks = useMemo(() => {
    const { field, order } = sortEntry;

    const filteredTasks = allTasks.filter((task) => {
      if (filters.length === 0) {
        return true;
      }

      const matchesFilter = (filter: Filter) => {
        const type = filter.type;
        switch (type) {
          case "predicate": {
            return filter.predicate(task, { selectedTaskIds });
          }
          case "field": {
            return task[filter.field] === filter.value;
          }
          default: {
            throw new Error(type as never);
          }
        }
      };

      const statusFilters = filters.filter((f) => f.group === "status");
      const isMatchingStatusFilter =
        statusFilters.length > 0 ? statusFilters.some(matchesFilter) : true;

      const selectionFilters = filters.filter((f) => f.group === "selection");
      const isMatchingSelectionFilter =
        selectionFilters.length > 0
          ? selectionFilters.some(matchesFilter)
          : true;

      return isMatchingStatusFilter && isMatchingSelectionFilter;
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
  }, [sortEntry, allTasks, filters, selectedTaskIds, searchText]);

  const paginatedTasks = useMemo(() => {
    return paginate(tasks, { page, limit });
  }, [limit, page, tasks]);

  const data: TasksData = useMemo(() => {
    return {
      paginatedTasks,
      selectedTaskIds,
      page,
      totalTasks: Math.ceil(tasks.length / limit),
      sortEntry,
      filters,
      scrollTargetRef,
      getTask: (id: string) => {
        return allTasks.find((t) => t.id === id);
      },
    };
  }, [
    allTasks,
    filters,
    limit,
    page,
    paginatedTasks,
    selectedTaskIds,
    sortEntry,
    tasks.length,
  ]);

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

      updateTasksStatus: (ids, status) => {
        setAllTasks((tasks) =>
          tasks.map((t) => {
            if (ids.includes(t.id)) {
              return { ...t, status };
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
        setSelectedTaskIds((ids) => ids.filter((i) => i !== id));
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

      removeFilter: (id) => {
        setFilters((filters) => filters.filter((f) => f.id !== id));
        setPage(1);
      },

      removeAllFilter: () => {
        setFilters([]);
        setPage(1);
      },

      setPage: (page) => {
        setPage(page);
        scrollTargetRef.current?.scrollTo(0, 0);
      },

      setLimit: (limit) => {
        setLimit(limit);
        setPage(1);
      },

      toggleTaskSelection: (id: string) => {
        setSelectedTaskIds((st) => {
          if (st.includes(id)) {
            return st.filter((i) => i !== id);
          }
          return [...st, id];
        });
      },

      selectAllTasksOnPage: () => {
        setSelectedTaskIds((ids) => {
          return Array.from(
            new Set([...ids, ...paginatedTasks.map((t) => t.id)]),
          );
        });
      },

      unselectAllTasksOnPage: () => {
        setSelectedTaskIds((ids) => {
          return ids.filter((id) => {
            return !paginatedTasks.find((t) => t.id === id);
          });
        });
      },

      unselectAllTasks: () => {
        setSelectedTaskIds([]);
      },
    };
  }, [paginatedTasks]);

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
