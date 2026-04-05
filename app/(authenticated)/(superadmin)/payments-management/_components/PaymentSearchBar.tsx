"use client";

import { useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
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
    [onSearchChange]
  );

  const handleClear = useCallback(() => {
    setSearchQuery("");
    onSearchChange("");
  }, [onSearchChange]);

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleChange}
        className="pl-4 pr-10"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
