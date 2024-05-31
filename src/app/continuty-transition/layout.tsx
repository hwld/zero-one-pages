import { ReactNode, Suspense } from "react";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <Suspense>{children}</Suspense>;
};

export default Layout;
