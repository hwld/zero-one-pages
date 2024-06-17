import { throwIfNotDevelopment } from "@/app/_test/utils";
import React, {
  PropsWithChildren,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

export type TaskSelectionContext = {
  selectedTaskIds: string[];

  selectTaskIds: (ids: string[]) => void;
  unselectTaskIds: (ids: string[]) => void;
  toggleTaskSelection: (id: string) => void;
  unselectAllTasks: () => void;
};

const TaskSelectionContext = createContext<TaskSelectionContext | undefined>(
  undefined,
);

export const TaskSelectionProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);

  const value = useMemo((): TaskSelectionContext => {
    return {
      selectedTaskIds,

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

      toggleTaskSelection: (id) => {
        setSelectedTaskIds((st) => {
          if (st.includes(id)) {
            return st.filter((i) => i !== id);
          }
          return [...st, id];
        });
      },

      unselectAllTasks: () => {
        setSelectedTaskIds([]);
      },
    };
  }, [selectedTaskIds]);

  return (
    <TaskSelectionContext.Provider value={value}>
      {children}
    </TaskSelectionContext.Provider>
  );
};

export const useTaskSelection = () => {
  const ctx = useContext(TaskSelectionContext);
  if (!ctx) {
    throw new Error(`${TaskSelectionProvider.name}が存在しません`);
  }
  return ctx;
};

export const MockTaskSelectionProvider: React.FC<
  PropsWithChildren & { value: TaskSelectionContext }
> = ({ children, value }) => {
  throwIfNotDevelopment();

  return (
    <TaskSelectionContext.Provider value={value}>
      {children}
    </TaskSelectionContext.Provider>
  );
};
