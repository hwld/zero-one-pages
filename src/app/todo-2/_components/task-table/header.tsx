import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsUpDownIcon,
} from "lucide-react";
import {
  SortEntry,
  useAllTasks,
  useTaskAction,
} from "../../_contexts/tasks-provider";

type Props = {
  icon?: React.FC<{ size?: number; className?: string }>;
  text: string;
  width?: number;
};

export const TableHeader: React.FC<Props> = ({ icon: Icon, text, width }) => {
  return (
    <th
      className="whitespace-nowrap border-b border-zinc-600 bg-black/10 p-2 font-medium text-zinc-400"
      style={{ width }}
    >
      <div className="text-m flex items-center gap-1 p-1">
        {Icon && <Icon size={15} />}
        <div className="mt-[1px]">{text}</div>
      </div>
    </th>
  );
};

type SortableTableHeaderProps = Props & {
  fieldName: SortEntry["field"];
};
export const SortableTableHeader: React.FC<SortableTableHeaderProps> = ({
  icon: Icon,
  text,
  width,
  fieldName,
}) => {
  const { sortEntry } = useAllTasks();
  const { sort } = useTaskAction();
  const isSorted = sortEntry.field === fieldName;

  const handleSort = () => {
    sort({
      field: fieldName,
      order: isSorted ? (sortEntry.order === "desc" ? "asc" : "desc") : "desc",
    });
  };

  return (
    <th
      className="whitespace-nowrap border-b border-zinc-600 bg-black/10 p-2 font-medium text-zinc-400"
      style={{ width }}
    >
      <button
        className="text-m flex items-center gap-1 rounded p-1 transition-colors hover:bg-white/10"
        onClick={handleSort}
      >
        {Icon && <Icon size={15} />}
        <div className="mt-[1px]">{text}</div>
        <SortedIcon field={fieldName} sortEntry={sortEntry} />
      </button>
    </th>
  );
};

const SortedIcon: React.FC<{
  field: SortEntry["field"];
  sortEntry: SortEntry;
}> = ({ field, sortEntry }) => {
  const size = 15;

  if (sortEntry.field !== field) {
    return <ChevronsUpDownIcon size={size} />;
  }
  if (sortEntry.order === "asc") {
    return <ChevronUpIcon size={size} />;
  }
  if (sortEntry.order === "desc") {
    return <ChevronDownIcon size={size} />;
  }
};
