import { ReactNode, useMemo, useState } from "react";
import { ViewOptionMenu } from "./menu";
import { FieldsConfigMenu } from "./config-menu/fields-menu";
import { ColumnByConfigMenu } from "./config-menu/column-by-menu";
import { GroupByConfigMenu } from "./config-menu/group-by-menu";
import { SortByConfigMenu } from "./config-menu/sort-by-menu";
import { FieldSumConfigMenu } from "./config-menu/field-sum-menu";
import { SliceByConfigMenu } from "./config-menu/slice-by-menu";
import { ChevronDownIcon } from "lucide-react";
import { DropdownMultiContent } from "../dropdown/content";
import { DropdownProvider } from "../dropdown/provider";
import { DropdownTrigger } from "../dropdown/trigger";
import { Tooltip } from "../tooltip";

export type ViewOptionMenuMode =
  | "close"
  | "main"
  | "fieldsConfig"
  | "columnByConfig"
  | "groupByConfig"
  | "sortByConfig"
  | "fieldSumConfig"
  | "sliceByConfig";

export const ViewOptionMenuTrigger: React.FC = () => {
  const [mode, setMode] = useState<ViewOptionMenuMode>("close");

  const contents = useMemo((): Record<ViewOptionMenuMode, ReactNode> => {
    return {
      close: null,
      main: <ViewOptionMenu onChangeMode={setMode} />,
      fieldsConfig: <FieldsConfigMenu onBack={() => setMode("main")} />,
      columnByConfig: <ColumnByConfigMenu onBack={() => setMode("main")} />,
      groupByConfig: <GroupByConfigMenu onBack={() => setMode("main")} />,
      sortByConfig: <SortByConfigMenu onBack={() => setMode("main")} />,
      fieldSumConfig: <FieldSumConfigMenu onBack={() => setMode("main")} />,
      sliceByConfig: <SliceByConfigMenu onBack={() => setMode("main")} />,
    };
  }, []);

  const isOpen = mode !== "close";
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setMode("main");
    } else {
      setMode("close");
    }
  };

  const handlekeEscapeKeydown = () => {
    if (mode === "main") {
      setMode("close");
    } else {
      setMode("main");
    }
  };

  return (
    <DropdownProvider isOpen={isOpen} onOpenChange={handleOpenChange}>
      <Tooltip label="View options">
        <DropdownTrigger>
          <button
            className="flex size-5 items-center justify-center rounded-md border border-neutral-700 bg-neutral-800 text-neutral-400 transition-colors hover:bg-neutral-600 hover:text-neutral-200"
            onClick={() => setMode("main")}
          >
            <ChevronDownIcon size={16} />
          </button>
        </DropdownTrigger>
      </Tooltip>
      <DropdownMultiContent
        mode={mode}
        contents={contents}
        onEscapeKeydown={handlekeEscapeKeydown}
      />
    </DropdownProvider>
  );
};
