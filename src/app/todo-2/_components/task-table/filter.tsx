import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  BoxSelectIcon,
  CheckIcon,
  CheckSquareIcon,
  CircleDashedIcon,
  CircleDotIcon,
  FilterIcon,
  LucideIcon,
  XIcon,
} from "lucide-react";
import { ReactNode, useState } from "react";
import {
  Filter,
  useTasksData,
  useTaskAction,
} from "../../_contexts/tasks-provider";

type FilterContent = Filter & { label: string; icon: LucideIcon };

const allStatusFilterContents = [
  {
    id: crypto.randomUUID(),
    type: "field",
    group: "status",
    field: "status",
    value: "todo",
    label: "Todo",
    icon: CircleDashedIcon,
  },
  {
    id: crypto.randomUUID(),
    type: "field",
    group: "status",
    field: "status",
    value: "done",
    label: "Done",
    icon: CircleDotIcon,
  },
] satisfies FilterContent[];

const allSelectionFilterContents = [
  {
    id: crypto.randomUUID(),
    type: "predicate",
    group: "selection",
    icon: CheckSquareIcon,
    label: "選択済み",
    predicate: (task, { selectedTaskIds }) => selectedTaskIds.includes(task.id),
  },
  {
    id: crypto.randomUUID(),
    type: "predicate",
    group: "selection",
    icon: BoxSelectIcon,
    label: "未選択",
    predicate: (task, { selectedTaskIds }) =>
      !selectedTaskIds.includes(task.id),
  },
] satisfies FilterContent[];

export const TaskTableFilter: React.FC = () => {
  const { filters } = useTasksData();
  const { addFilter, removeFilter, removeAllFilter } = useTaskAction();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <DropdownMenu
      open={isFilterOpen}
      onOpenChange={setIsFilterOpen}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1 rounded bg-zinc-300 p-2 text-xs text-zinc-700">
          <FilterIcon size={15} />
          <p className="mt-[1px] whitespace-nowrap">絞り込み</p>
          {filters.length > 0 && (
            <div className="size-[16px] rounded-full bg-zinc-700 text-zinc-100">
              {filters.length}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {isFilterOpen && (
          <DropdownMenuPortal forceMount>
            <DropdownMenuContent
              asChild
              side="bottom"
              align="start"
              sideOffset={4}
            >
              <motion.div
                className="flex w-[200px] flex-col gap-1 rounded bg-zinc-300 p-1 text-zinc-700"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
              >
                <FilterGroup label="状況">
                  {allStatusFilterContents.map((filter, i) => {
                    const isSelected = !!filters.find(
                      (f) => f.id === filter.id,
                    );

                    const handleSelect = () => {
                      if (isSelected) {
                        removeFilter(filter.id);
                      } else {
                        addFilter(filter);
                      }
                    };

                    return (
                      <FilterItem
                        key={i}
                        label={filter.label}
                        icon={filter.icon}
                        filter={filter}
                        isSelected={isSelected}
                        onSelect={handleSelect}
                      />
                    );
                  })}
                </FilterGroup>
                <FilterGroup label="選択">
                  {allSelectionFilterContents.map((filter, i) => {
                    const isSelected = !!filters.find(
                      (f) => f.id === filter.id,
                    );

                    const handleSelect = () => {
                      if (isSelected) {
                        removeFilter(filter.id);
                      } else {
                        addFilter(filter);
                      }
                    };

                    return (
                      <FilterItem
                        key={i}
                        label={filter.label}
                        icon={filter.icon}
                        filter={filter}
                        isSelected={isSelected}
                        onSelect={handleSelect}
                      />
                    );
                  })}
                </FilterGroup>
                <div className="w-full space-y-1">
                  <div className="h-[1px] w-full bg-black/10" />
                  <button
                    className="flex w-full items-center gap-1 rounded p-2 text-xs enabled:hover:bg-black/15 disabled:text-zinc-400"
                    onClick={removeAllFilter}
                    disabled={filters.length === 0}
                  >
                    <XIcon size={16} />
                    絞り込みを解除する
                  </button>
                </div>
              </motion.div>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
};

const FilterGroup: React.FC<{ children: ReactNode; label: string }> = ({
  children,
  label,
}) => {
  return (
    <div>
      <p className="p-1 text-xs text-zinc-500">{label}</p>
      <div>{children}</div>
    </div>
  );
};

type FilterItemProps = {
  label: string;
  icon: LucideIcon;
  isSelected: boolean;
  filter: Filter;
  onSelect: (filter: Filter) => void;
};
const FilterItem: React.FC<FilterItemProps> = ({
  label,
  icon: Icon,
  isSelected = true,
  filter,
  onSelect,
}) => {
  const handleSelect = (e: Event) => {
    e.preventDefault();
    onSelect(filter);
  };

  return (
    <DropdownMenuItem
      className="flex cursor-pointer items-center justify-end gap-1 rounded px-2 py-1 text-sm transition-colors hover:bg-black/15 focus-visible:bg-black/15 focus-visible:outline-none"
      onSelect={handleSelect}
    >
      <div className="flex grow select-none items-center gap-1">
        <Icon size={12} />
        <p>{label}</p>
      </div>
      <div
        className={clsx(
          "grid size-[16px] appearance-none place-items-center overflow-hidden rounded border border-zinc-500",
          isSelected ? "bg-zinc-700" : "bg-transparent",
        )}
      >
        {isSelected && (
          <CheckIcon className="text-zinc-100" size={12} strokeWidth={3} />
        )}
      </div>
    </DropdownMenuItem>
  );
};
