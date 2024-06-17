import {
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { FieldFilter, SelectionFilter } from "../_mocks/api";

export type TasksData = {
  searchText: string;
  page: number;
  limit: number;
  scrollTargetRef: RefObject<HTMLDivElement>;
  fieldFilters: FieldFilter[];
  selectionFilter: SelectionFilter;
};

export type TasksAction = {
  search: (text: string) => void;

  addFieldFilter: (filter: FieldFilter) => void;
  removeFieldFilter: (filterId: string) => void;
  setSelectionFilter: (filter: SelectionFilter) => void;
  removeAllFilter: () => void;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
};

const TasksDataContext = createContext<TasksData | undefined>(undefined);
const TasksActionContext = createContext<TasksAction | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  // これらの情報はquery paramsで持った方が良いが、UIを作ることが目的なので・・・
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);
  const [searchText, setSearchText] = useState("");
  const [fieldFilters, setFieldFilters] = useState<FieldFilter[]>([]);
  const [selectionFilter, setSelectionFilter] = useState<SelectionFilter>(null);

  const data = useMemo((): TasksData => {
    return {
      page,
      limit,
      searchText,
      fieldFilters,
      selectionFilter,
      scrollTargetRef,
    };
  }, [fieldFilters, limit, page, searchText, selectionFilter]);

  const action = useMemo((): TasksAction => {
    return {
      search: (text) => {
        setSearchText(text);
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
        setPage(1);
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
    throw new Error(`${TasksProvider.name}が存在しません`);
  }
  return ctx;
};

export const useTaskAction = (): TasksAction => {
  const ctx = useContext(TasksActionContext);
  if (!ctx) {
    throw new Error(`${TasksProvider.name}が存在しません`);
  }
  return ctx;
};
