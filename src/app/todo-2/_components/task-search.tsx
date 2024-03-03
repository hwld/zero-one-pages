import { SearchIcon, XIcon } from "lucide-react";
import { useTaskAction } from "../_contexts/tasks-provider";
import { useState } from "react";

export const TaskSearch: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const { search } = useTaskAction();

  const handleSearch = () => {
    search(searchText);
  };

  const handleSearchReset = () => {
    setSearchText("");
    search("");
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <SearchIcon
          className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2"
          size={18}
        />
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="h-8 w-[400px] rounded border border-zinc-500 bg-transparent px-7 py-1 text-sm focus-within:border-zinc-300 focus-within:outline-none"
        />
        {searchText.length > 0 && (
          <button
            onClick={handleSearchReset}
            className="absolute right-2 top-1/2 -translate-y-1/2 transition-colors hover:bg-white/15"
          >
            <XIcon size={18} />
          </button>
        )}
      </div>
      <button
        onClick={handleSearch}
        className="h-8 shrink-0 rounded bg-zinc-300 px-3 py-1 text-xs text-zinc-700"
      >
        検索
      </button>
    </div>
  );
};
