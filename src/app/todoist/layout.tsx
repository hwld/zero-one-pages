import { ReactNode } from "react";
import { Sidebar } from "./_components/sidebar/sidebar";

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="text-neutral-00 flex h-[100dvh] bg-stone-50 text-sm">
      <Sidebar />
      <div className="min-h-full w-full pl-16 pt-8">{children}</div>
    </div>
  );
};

export default Layout;
