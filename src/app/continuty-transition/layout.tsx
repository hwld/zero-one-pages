import { ReactNode, Suspense } from "react";
import "./style.css";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <Suspense>{children}</Suspense>;
};

export default Layout;
