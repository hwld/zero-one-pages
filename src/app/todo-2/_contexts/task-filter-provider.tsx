import { throwIfNotDevelopment } from "@/app/_test/utils";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { FieldFilter, SelectionFilter } from "../_mocks/api";
import { useTaskAction } from "./tasks-provider";

export type TaskFilterContext = {
  fieldFilters: FieldFilter[];
  selectionFilter: SelectionFilter;

  addFieldFilter: (filter: FieldFilter) => void;
  removeFieldFilter: (filterId: string) => void;
  setSelectionFilter: (filter: SelectionFilter) => void;
  removeAllFilter: () => void;
};

const TaskFilterContext = createContext<TaskFilterContext | undefined>(
  undefined,
);

export const TaskFilterProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { setPage } = useTaskAction();

  const [fieldFilters, setFieldFilters] = useState<FieldFilter[]>([]);
  const [selectionFilter, setSelectionFilter] = useState<SelectionFilter>(null);

  const value = useMemo((): TaskFilterContext => {
    return {
      fieldFilters,
      selectionFilter,

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
    };
  }, [fieldFilters, selectionFilter, setPage]);

  return (
    <TaskFilterContext.Provider value={value}>
      {children}
    </TaskFilterContext.Provider>
  );
};

export const useTaskFilter = () => {
  const ctx = useContext(TaskFilterContext);
  if (!ctx) {
    throw new Error(`${TaskFilterProvider.name}が存在しません`);
  }
  return ctx;
};

export const MockTaskFilterProvider: React.FC<
  { value: TaskFilterContext } & PropsWithChildren
> = ({ value, children }) => {
  throwIfNotDevelopment();

  return (
    <TaskFilterContext.Provider value={value}>
      {children}
    </TaskFilterContext.Provider>
  );
};
