import { useMemo, useState } from "react";
import { useGlobalCommandConfig } from "../global-command";
import {
  BoxSelectIcon,
  RefreshCcwIcon,
  TriangleAlertIcon,
  TriangleIcon,
} from "lucide-react";
import { taskStore } from "./_mocks/task-store";
import { useQueryClient } from "@tanstack/react-query";

export const useTodo2HomeCommands = () => {
  const client = useQueryClient();
  const [isErrorMode, setIsErrorMode] = useState(false);

  useGlobalCommandConfig(
    useMemo(() => {
      return {
        newCommands: [
          {
            icon: isErrorMode ? TriangleIcon : TriangleAlertIcon,
            label: isErrorMode
              ? "タスク取得エラーを止める"
              : "タスク取得エラーを発生させる",
            action: async () => {
              setIsErrorMode((s) => !s);
              if (isErrorMode) {
                taskStore.stopSimulateError();
              } else {
                taskStore.simulateError();
              }
              client.refetchQueries();
            },
          },
          {
            icon: BoxSelectIcon,
            label: "タスクを空にする",
            action: async () => {
              taskStore.clear();
              client.refetchQueries();
            },
          },
          {
            icon: RefreshCcwIcon,
            label: "タスクを初期化する",
            action: async () => {
              taskStore.reset();
              client.refetchQueries();
            },
          },
        ],
      };
    }, [client, isErrorMode]),
  );
};
