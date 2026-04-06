"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { CreateElectionDialog } from "./CreateElectionDialog";

interface SearchAndFilterProps {
  onSearch: (query: string) => void;
}

export function SearchAndFilter({ onSearch }: SearchAndFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      onSearch(value);
    },
    [onSearch]
  );

  return (
    <div className="flex gap-3 items-center justify-between">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search elections by title..."
          className="pl-10"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <CreateElectionDialog />
    </div>
  );
}
