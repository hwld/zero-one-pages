import {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

export type TaskPagingContext = {
  page: number;
  limit: number;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
};

const TaskPagingContext = createContext<TaskPagingContext | undefined>(
  undefined,
);

export const TaskPagingProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(30);

  const value = useMemo((): TaskPagingContext => {
    return {
      page,
      limit,
      setPage,
      setLimit,
    };
  }, [limit, page]);

  return (
    <TaskPagingContext.Provider value={value}>
      {children}
    </TaskPagingContext.Provider>
  );
};

export const useTaskPaging = () => {
  const ctx = useContext(TaskPagingContext);
  if (!ctx) {
    throw new Error(`${TaskPagingProvider.name}が存在しません`);
  }

  return ctx;
};

export const MockTaskPaginProvider: React.FC<
  { value: TaskPagingContext } & PropsWithChildren
> = ({ children, value }) => {
  return (
    <TaskPagingContext.Provider value={value}>
      {children}
    </TaskPagingContext.Provider>
  );
};
