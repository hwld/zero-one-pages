import {
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useMemo,
  useRef,
} from "react";

export type TasksData = {
  scrollTargetRef: RefObject<HTMLDivElement>;
};

const TasksDataContext = createContext<TasksData | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  const data = useMemo((): TasksData => {
    return {
      scrollTargetRef,
    };
  }, []);

  return (
    <TasksDataContext.Provider value={data}>
      {children}
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
