import {
  Columns2Icon,
  GalleryHorizontalEndIcon,
  LayersIcon,
  LineChartIcon,
  MoveVerticalIcon,
  PenIcon,
  Rows2Icon,
  TableRowsSplitIcon,
  TextIcon,
  TrashIcon,
  UploadIcon,
} from "lucide-react";
import { DropdownCard } from "../dropdown/card";
import {
  DropdownItem,
  DropdownItemGroup,
  DropdownItemList,
  ViewConfigMenuItem,
} from "../dropdown/item";
import { ViewOptionMenuMode } from "./trigger";
import { Divider } from "../divider";

type Props = {
  onChangeMode: (mode: ViewOptionMenuMode) => void;
};

export const ViewOptionMenu: React.FC<Props> = ({ onChangeMode }) => {
  return (
    <DropdownCard width={320}>
      <DropdownItemGroup group="configuration">
        <ViewConfigMenuItem
          icon={TextIcon}
          title="Fields"
          value="Title, Assignees, Status, Foo, Bar"
          onClick={() => {
            onChangeMode("fieldsConfig");
          }}
        />
        <ViewConfigMenuItem
          icon={Columns2Icon}
          title="Column by:"
          value="Status"
          onClick={() => {
            onChangeMode("columnByConfig");
          }}
        />
        <ViewConfigMenuItem
          icon={Rows2Icon}
          title="Group by"
          value="none"
          onClick={() => {
            onChangeMode("groupByConfig");
          }}
        />
        <ViewConfigMenuItem
          icon={MoveVerticalIcon}
          title="Sort by"
          value="manual"
          onClick={() => {
            onChangeMode("sortByConfig");
          }}
        />
        <ViewConfigMenuItem
          icon={LayersIcon}
          title="Field sum"
          value="Count"
          onClick={() => {
            onChangeMode("fieldSumConfig");
          }}
        />
        <ViewConfigMenuItem
          icon={TableRowsSplitIcon}
          title="Slice by"
          value="Status"
          onClick={() => {
            onChangeMode("sliceByConfig");
          }}
        />
      </DropdownItemGroup>
      <Divider />
      <DropdownItemList>
        <DropdownItem icon={LineChartIcon} title="Generate chart" />
      </DropdownItemList>
      <Divider />
      <DropdownItemList>
        <DropdownItem icon={PenIcon} title="Rename view" />
        <DropdownItem
          icon={GalleryHorizontalEndIcon}
          title="Save changes to new view"
        />
        <DropdownItem icon={TrashIcon} title="Delete view" red />
      </DropdownItemList>
      <Divider />
      <DropdownItemList>
        <DropdownItem icon={UploadIcon} title="Export view data" />
      </DropdownItemList>
      <Divider />
      <DropdownItemList>
        <div className="grid h-8 grid-cols-2 gap-2">
          <button className="grow rounded-md text-neutral-300 transition-colors hover:bg-white/15">
            Discard
          </button>
          <button className="grow rounded-md border border-green-500 text-green-500 transition-colors hover:bg-green-500/15">
            Save
          </button>
        </div>
      </DropdownItemList>
    </DropdownCard>
  );
};
