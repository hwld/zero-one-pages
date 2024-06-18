import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { SortEntry } from "../_mocks/api";
import { useTaskAction } from "./tasks-provider";
import { throwIfNotDevelopment } from "@/app/_test/utils";

export type TaskSortContext = {
  sortEntry: SortEntry;
  sort: (entry: SortEntry) => void;
};

const TaskSortContext = createContext<TaskSortContext | undefined>(undefined);

export const TaskSortProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { setPage } = useTaskAction();

  const [sortEntry, setSortEntry] = useState<SortEntry>({
    field: "createdAt",
    order: "desc",
  });

  const value = useMemo((): TaskSortContext => {
    return {
      sortEntry,
      sort: (entry) => {
        setSortEntry(entry);
        setPage(1);
      },
    };
  }, [setPage, sortEntry]);

  return (
    <TaskSortContext.Provider value={value}>
      {children}
    </TaskSortContext.Provider>
  );
};

export const useTaskSort = () => {
  const ctx = useContext(TaskSortContext);
  if (!ctx) {
    throw new Error(`${TaskSortProvider.name}が存在しません`);
  }
  return ctx;
};

export const MockTaskSortProvider: React.FC<
  { value: TaskSortContext } & PropsWithChildren
> = ({ value, children }) => {
  throwIfNotDevelopment();

  return (
    <TaskSortContext.Provider value={value}>
      {children}
    </TaskSortContext.Provider>
  );
};
