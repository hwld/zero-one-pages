import { errorIfNotDevelopment } from "@/app/_test/utils";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";
import { useTasksData } from "../../_contexts/tasks-provider";

export type TaskTablePagingContext = {
  page: number;
  limit: number;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
};

const TaskTablePagingContext = createContext<
  TaskTablePagingContext | undefined
>(undefined);

export const TaskTablePagingProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { scrollTargetRef } = useTasksData();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);

  const value = useMemo((): TaskTablePagingContext => {
    return {
      page,
      limit,
      setPage: (page) => {
        setPage(page);
        scrollTargetRef.current?.scrollTo(0, 0);
      },
      setLimit,
    };
  }, [limit, page, scrollTargetRef]);

  return (
    <TaskTablePagingContext.Provider value={value}>
      {children}
    </TaskTablePagingContext.Provider>
  );
};

export const useTaskTablePaging = () => {
  const ctx = useContext(TaskTablePagingContext);
  if (!ctx) {
    throw new Error(`${TaskTablePagingProvider.name}が存在しません`);
  }

  return ctx;
};

export const MockTaskTablePagingProvider: React.FC<
  { value?: TaskTablePagingContext } & PropsWithChildren
> = ({ children, value }) => {
  errorIfNotDevelopment();

  if (!value) {
    return <TaskTablePagingProvider>{children}</TaskTablePagingProvider>;
  }

  return (
    <TaskTablePagingContext.Provider value={value}>
      {children}
    </TaskTablePagingContext.Provider>
  );
};
