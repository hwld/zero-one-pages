import { useEffect, useMemo, useState } from "react";
import { useGlobalCommandConfig } from "../_providers/global-command-provider";
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
            label: `タスク取得エラーを${isErrorMode ? "止める" : "発生させる"}`,
            action: async () => {
              setIsErrorMode((s) => !s);
              if (isErrorMode) {
                taskStore.removeErrorSimulationScope("getAll");
              } else {
                taskStore.addErrorSimulationScope("getAll");
              }

              client.refetchQueries();
            },
          },
          {
            icon: BoxSelectIcon,
            label: "タスク一覧を空にする",
            action: async () => {
              taskStore.clear();
              client.refetchQueries();
            },
          },
          {
            icon: RefreshCcwIcon,
            label: "タスク一覧を初期化する",
            action: async () => {
              taskStore.reset();
              client.refetchQueries();
            },
          },
        ],
      };
    }, [client, isErrorMode]),
  );

  useEffect(() => {
    taskStore.stopErrorSimulation();
    return () => {
      taskStore.stopErrorSimulation();
    };
  }, []);
};

export const useTodo2DetailCommands = () => {
  const client = useQueryClient();
  const [isErrorMode, setIsErrorMode] = useState(false);
  useGlobalCommandConfig(
    useMemo(() => {
      return {
        newCommands: [
          {
            icon: isErrorMode ? TriangleIcon : TriangleAlertIcon,
            label: `タスク取得エラーを${isErrorMode ? "止める" : "発生させる"}`,
            action: async () => {
              setIsErrorMode((s) => !s);
              if (isErrorMode) {
                taskStore.removeErrorSimulationScope("get");
              } else {
                taskStore.addErrorSimulationScope("get");
              }

              client.refetchQueries();
            },
          },
        ],
      };
    }, [client, isErrorMode]),
  );

  useEffect(() => {
    taskStore.stopErrorSimulation();
    return () => {
      taskStore.stopErrorSimulation();
    };
  }, []);
};
