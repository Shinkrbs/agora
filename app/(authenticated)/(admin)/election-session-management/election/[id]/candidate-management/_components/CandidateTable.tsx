"use client";

import { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnDef,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, AlertCircle, Pencil, Trash2 } from "lucide-react";
import { CandidateTableRow } from "../_types/candidate-types";
import { ElectionSession } from "@/types/database";

interface CandidateTableProps {
  data: CandidateTableRow[];
  isLoading: boolean;
  onEdit: (candidate: CandidateTableRow) => void;
  onDelete: (candidate: CandidateTableRow) => void;
  onSearch: (query: string) => void;
  election: ElectionSession | null;
}

export function CandidateTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onSearch,
  election,
}: CandidateTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns = useMemo<ColumnDef<CandidateTableRow>[]>(
    () => [
      {
        accessorKey: "full_name",
        header: "Candidate",
        cell: ({ row }) => {
          const candidate = row.original;
          const initials =
            `${candidate.raw_candidate.first_name[0]}${candidate.raw_candidate.last_name[0]}`.toUpperCase();

          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={candidate.image_url || undefined}
                  alt={candidate.full_name}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium">{candidate.full_name}</span>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "position_name",
        header: "Position",
        cell: ({ row }) => <span>{row.original.position_name}</span>,
      },
      {
        accessorKey: "partylist_name",
        header: "Partylist",
        cell: ({ row }) => {
          const candidate = row.original;
          if (candidate.is_independent) {
            return <Badge variant="secondary">Independent</Badge>;
          }
          return (
            <Badge>
              {candidate.partylist_shorthand || candidate.partylist_name}
            </Badge>
          );
        },
      },
      {
        accessorKey: "has_platform",
        header: "Platform",
        cell: ({ row }) => {
          const hasPlatform = row.original.has_platform;
          return hasPlatform ? (
            <div className="flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600">Added</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-600">Not Added</span>
            </div>
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const candidate = row.original;

          return (
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => onEdit(candidate)}
                aria-label={`Edit ${candidate.full_name}`}
                title="Edit candidate"
                disabled={election?.status === "completed"}
              >
                <Pencil className="h-4 w-4 text-slate-900 dark:text-white" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => onDelete(candidate)}
                aria-label={`Delete ${candidate.full_name}`}
                title="Delete candidate"
                disabled={election?.status === "completed"}
              >
                <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-muted-foreground py-8"
                >
                  Loading candidates...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-muted-foreground py-8"
                >
                  No candidates found
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
