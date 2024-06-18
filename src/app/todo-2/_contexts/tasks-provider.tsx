import {
  ReactNode,
  RefObject,
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTaskPaging } from "./task-paging-provider";

export type TasksData = {
  searchText: string;
  scrollTargetRef: RefObject<HTMLDivElement>;
};

export type TasksAction = {
  search: (text: string) => void;
};

const TasksDataContext = createContext<TasksData | undefined>(undefined);
const TasksActionContext = createContext<TasksAction | undefined>(undefined);

export const TasksProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { setPage } = useTaskPaging();
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  // これらの情報はquery paramsで持った方が良いが、UIを作ることが目的なので・・・
  const [searchText, setSearchText] = useState("");

  const data = useMemo((): TasksData => {
    return {
      searchText,
      scrollTargetRef,
    };
  }, [searchText]);

  const action = useMemo((): TasksAction => {
    return {
      search: (text) => {
        setSearchText(text);
        setPage(1);
      },
    };
  }, [setPage]);

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
