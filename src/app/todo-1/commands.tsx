import { useQueryClient } from "@tanstack/react-query";
import { useGlobalCommandConfig } from "../_providers/global-command/global-command-provider";
import { useEffect, useMemo, useState } from "react";
import {
  BoxSelectIcon,
  RefreshCcwIcon,
  TriangleAlert,
  TriangleIcon,
} from "lucide-react";
import { taskStore } from "./_backend/task-store";

export const useTodo1HomeCommands = () => {
  const client = useQueryClient();
  const [isSimulatingError, setIsSimulatingError] = useState(false);

  useGlobalCommandConfig(
    useMemo(() => {
      return {
        newCommands: [
          {
            icon: isSimulatingError ? TriangleIcon : TriangleAlert,
            label: `エラーを${isSimulatingError ? "止める" : "発生させる"}`,
            action: async () => {
              setIsSimulatingError((s) => !s);
              if (isSimulatingError) {
                taskStore.stopErrorSimulation();
              } else {
                taskStore.startErrorSimulation();
              }

              client.refetchQueries();
            },
          },
          {
            icon: BoxSelectIcon,
            label: "タスク一覧を空にする",
            action: () => {
              taskStore.clear();
              client.refetchQueries();
            },
          },
          {
            icon: RefreshCcwIcon,
            label: "タスク一覧を初期化する",
            action: () => {
              taskStore.reset();
              client.refetchQueries();
            },
          },
        ],
      };
    }, [client, isSimulatingError]),
  );

  useEffect(() => {
    taskStore.stopErrorSimulation();
    return () => {
      taskStore.stopErrorSimulation();
    };
  }, []);
};
