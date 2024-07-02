import { PanelResizeHandle as OriginPanelResizeHandle } from "react-resizable-panels";

export const PanelResizeHandle: React.FC = () => {
  return (
    <OriginPanelResizeHandle className="h-full w-[2px] bg-neutral-600 transition-colors data-[resize-handle-state=drag]:bg-blue-500 data-[resize-handle-state=hover]:bg-neutral-500" />
  );
};
