import { SearchIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { useTaskTableSearch } from "./task-table/search-provider";

export const TaskSearch: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const { search } = useTaskTableSearch();

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
      <Button onClick={handleSearch}>検索</Button>
    </div>
  );
};
