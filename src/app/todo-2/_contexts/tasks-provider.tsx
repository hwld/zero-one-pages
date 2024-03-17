import {
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { FieldFilter, SelectionFilter, SortEntry } from "../_mocks/api";

export type TasksData = {
  searchText: string;
  selectedTaskIds: string[];
  page: number;
  limit: number;
  sortEntry: SortEntry;
  scrollTargetRef: RefObject<HTMLDivElement>;
  fieldFilters: FieldFilter[];
  selectionFilter: SelectionFilter;
};

export type TasksAction = {
  search: (text: string) => void;

  sort: (entry: SortEntry) => void;

  addFieldFilter: (filter: FieldFilter) => void;
  removeFieldFilter: (filterId: string) => void;
  setSelectionFilter: (filter: SelectionFilter) => void;
  removeAllFilter: () => void;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;

  selectTaskIds: (ids: string[]) => void;
  unselectTaskIds: (ids: string[]) => void;
  toggleTaskSelection: (id: string) => void;
  unselectAllTasks: () => void;
};

const TasksDataContext = createContext<TasksData | undefined>(undefined);
const TasksActionContext = createContext<TasksAction | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
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
  const [fieldFilters, setFieldFilters] = useState<FieldFilter[]>([]);
  const [selectionFilter, setSelectionFilter] = useState<SelectionFilter>(null);

  const data: TasksData = useMemo(() => {
    return {
      selectedTaskIds,
      page,
      limit,
      searchText,
      sortEntry,
      fieldFilters,
      selectionFilter,
      scrollTargetRef,
    };
  }, [
    fieldFilters,
    limit,
    page,
    searchText,
    selectedTaskIds,
    selectionFilter,
    sortEntry,
  ]);

  const action: TasksAction = useMemo(() => {
    return {
      search: (text) => {
        setSearchText(text);
        setPage(1);
      },

      sort: (entry) => {
        setSortEntry(entry);
        setPage(1);
      },

      addFieldFilter: (filter) => {
        setFieldFilters((f) => [...f, filter]);
        setPage(1);
      },

      removeFieldFilter: (id) => {
        setFieldFilters((filters) => filters.filter((f) => f.id !== id));
        setPage(1);
      },

      setSelectionFilter: (filter) => {
        setSelectionFilter(filter);
      },

      removeAllFilter: () => {
        setFieldFilters([]);
        setSelectionFilter(null);
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

      selectTaskIds: (ids) => {
        setSelectedTaskIds((prev) => {
          return Array.from(new Set([...prev, ...ids]));
        });
      },

      unselectTaskIds: (ids) => {
        setSelectedTaskIds((selectedIds) => {
          return selectedIds.filter((selectedId) => {
            return !ids.includes(selectedId);
          });
        });
      },

      unselectAllTasks: () => {
        setSelectedTaskIds([]);
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

export const useTaskAction = (): TasksAction => {
  const ctx = useContext(TasksActionContext);
  if (!ctx) {
    throw new Error("TasksProviderが存在しません");
  }
  return ctx;
};
