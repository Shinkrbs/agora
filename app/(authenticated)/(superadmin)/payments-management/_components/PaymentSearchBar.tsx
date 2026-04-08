"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentSearchBarProps {
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export function PaymentSearchBar({
  onSearchChange,
  placeholder = "Search by organization, contact name, or email...",
}: PaymentSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      onSearchChange(value);
    },
    [onSearchChange],
  );

  const handleClear = useCallback(() => {
    setSearchQuery("");
    onSearchChange("");
  }, [onSearchChange]);

  return (
    <div className="relative w-full max-w-xl">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleChange}
        className="h-10 rounded-lg bg-background pl-9 pr-10"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute right-1.5 top-1/2 -translate-y-1/2"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
}
