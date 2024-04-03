// TODO: views/{id}

import { CatIcon, GhostIcon } from "lucide-react";
import { MainPanel } from "./_components/main-panel";
import { SlicerPanel } from "./_components/slicer-panel/slicer-panel";
import { useView } from "./_queries/use-view";
import { VIEW_ID } from "./consts";
import { Button } from "./_components/button";

export const ViewPage: React.FC = () => {
  const { data: view, status } = useView(VIEW_ID);

  if (status === "pending") {
    return (
      <div className="grid h-full w-full place-content-center place-items-center gap-2 text-neutral-400">
        <CatIcon size={50} className="animate-bounce" />
        <div className="text-sm">One moment please...</div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="-mt-10 grid h-full w-full place-content-center place-items-center gap-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <GhostIcon size={150} />
          <div className="text-center text-sm text-neutral-100">
            データ読み込みに
            <br />
            失敗しました
          </div>
        </div>
        <Button color="primary" onClick={() => window.location.reload()}>
          更新する
        </Button>
      </div>
    );
  }

  return (
    <>
      <SlicerPanel columns={view.columns ?? []} />
      <MainPanel view={view} />
    </>
  );
};
