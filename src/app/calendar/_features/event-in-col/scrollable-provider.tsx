import {
  PropsWithChildren,
  RefObject,
  createContext,
  useContext,
  useRef,
} from "react";

const Context = createContext<RefObject<HTMLDivElement> | undefined>(undefined);

export const useScrollableElement = () => {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error(`${ScrollableProvider.name}が存在しません。`);
  }
  return ctx;
};

export const ScrollableProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const scrollableRef = useRef<HTMLDivElement>(null);
  return <Context.Provider value={scrollableRef}>{children}</Context.Provider>;
};
