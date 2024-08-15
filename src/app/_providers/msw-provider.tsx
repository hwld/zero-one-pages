"use client";
import { todo2Handlers } from "../todo-2/_backend/api";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { setupWorker } from "msw/browser";
import { githubProjcetApiHandler } from "../github-project/_backend/api";
import { calendarApiHandlers } from "../calendar/_backend/api";
import { todoistApiHandler } from "../todoist/_backend/api";
import { todo1Handlers } from "../todo-1/_backend/api";

type MswState = { isMockserverUp: boolean };
const MswContext = createContext<MswState | undefined>(undefined);

export const useMswState = (): MswState => {
  const ctx = useContext(MswContext);
  if (!ctx) {
    throw new Error("MswProviderが存在しません。");
  }
  return ctx;
};

export const MswProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mswStae, setMswState] = useState<MswState>({
    isMockserverUp: false,
  });

  useEffect(() => {
    const handlers = [
      ...todo1Handlers,
      ...todo2Handlers,
      ...githubProjcetApiHandler,
      ...calendarApiHandlers,
      ...todoistApiHandler,
    ];
    const worker = setupWorker(...handlers);

    const start = async () => {
      await worker.start({
        onUnhandledRequest: "bypass",
      });
      setMswState({ isMockserverUp: true });
    };

    start();

    return () => {
      worker.stop();
      setMswState({ isMockserverUp: false });
    };
  }, []);

  return <MswContext.Provider value={mswStae}>{children}</MswContext.Provider>;
};

export const SetupCompletedMswProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <MswContext.Provider value={{ isMockserverUp: true }}>
      {children}
    </MswContext.Provider>
  );
};
