import { GlobalCommand } from "./_providers/global-command/global-command";
import "./home.css";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex h-[100dvh] w-full flex-col items-center justify-center gap-14 bg-neutral-900 text-zinc-200">
      <div className="flex flex-col items-center gap-2 text-sm">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="text-center">
          ページが存在しません
          <br />
          下のメニューからページに移動することができます
        </p>
      </div>
      <div className="h-[450px] w-[95%] max-w-[600px]">
        <GlobalCommand />
      </div>
    </div>
  );
};

export default NotFoundPage;
