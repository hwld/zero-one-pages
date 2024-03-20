import { useQueryClient } from "@tanstack/react-query";
import { useGlobalCommandConfig } from "../global-command";
import { useMemo } from "react";
import { BoxSelectIcon, RefreshCcwIcon } from "lucide-react";
import { taskStore } from "./_mocks/task-store";

export const useTodo1HomeCommands = () => {
  const client = useQueryClient();

  useGlobalCommandConfig(
    useMemo(() => {
      return {
        newCommands: [
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
    }, [client]),
  );
};
