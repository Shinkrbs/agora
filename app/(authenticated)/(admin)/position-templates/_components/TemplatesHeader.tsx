'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';

interface TemplatesHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'name-asc' | 'date-desc';
  onSortChange: (sort: 'name-asc' | 'date-desc') => void;
  onAddTemplate: () => void;
}

export function TemplatesHeader({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  onAddTemplate,
}: TemplatesHeaderProps) {
  return (
    <div className="space-y-4 mb-8">
      {/* Title and Subtitle */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Position Templates</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage reusable position templates for your elections.
        </p>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-1 sm:items-center sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Sort Select */}
          <Select value={sortBy} onValueChange={(value) => onSortChange(value as 'name-asc' | 'date-desc')}>
            <SelectTrigger className="w-full sm:w-50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="date-desc">Date Created (Newest)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add Template Button */}
        <Button
          onClick={onAddTemplate}
          className="sm:whitespace-nowrap"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Template
        </Button>
      </div>
    </div>
  );
}
