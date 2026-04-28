"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, Plus, Upload, MoreHorizontal, Copy, Check } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VoterTableRow, VoterCodeStatus } from "../_types/voter-types";
import { AddEditVoterModal } from "./AddEditVoterModal";
import { ImportVotersModal } from "./ImportVotersModal";
import { DeleteVoterModal } from "./DeleteVoterModal";

interface VoterTableProps {
  voters: VoterTableRow[];
}

export function VoterTable({ voters: initialVoters }: VoterTableProps) {
  const [data, setData] = useState<VoterTableRow[]>(initialVoters);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<VoterCodeStatus | "ALL">(
    "ALL"
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal states
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState<VoterTableRow | null>(null);

  const handleCopyCode = useCallback((code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleEditVoter = useCallback((voter: VoterTableRow) => {
    // Use setTimeout to allow DropdownMenu to close and clear its DOM locks first
    setTimeout(() => {
      setSelectedVoter(voter);
      setIsAddEditOpen(true);
    }, 10);
  }, []);

  const handleDeleteVoter = useCallback((voter: VoterTableRow) => {
    // Use setTimeout to allow DropdownMenu to close and clear its DOM locks first
    setTimeout(() => {
      setSelectedVoter(voter);
      setIsDeleteOpen(true);
    }, 10);
  }, []);

  const handleResendCode = useCallback((voter: VoterTableRow) => {
    // Placeholder for resend code action
    console.log("Resend code for voter:", voter.id);
  }, []);

  const handleAddVoter = useCallback(() => {
    setSelectedVoter(null);
    setIsAddEditOpen(true);
  }, []);

  const columns: ColumnDef<VoterTableRow>[] = useMemo(
    () => [
      {
        accessorKey: "student_id",
        header: "Student ID",
        cell: ({ row }) => <div className="font-medium">{row.getValue("student_id")}</div>,
      },

      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <div className="text-sm text-muted-foreground">{row.getValue("email")}</div>,
      },
      {
        accessorKey: "voting_code",
        header: "Voting Code",
        cell: ({ row }) => {
          const code = row.getValue("voting_code") as string;
          const id = row.original.id;
          const isCopied = copiedId === id;
          return (
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                {code}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyCode(code, id)}
                className="h-7 w-7 p-0"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          );
        },
      },
      {
        accessorKey: "code_status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("code_status") as VoterCodeStatus;
          return (
            <Badge
              variant={status === "voted" ? "default" : "secondary"}
              className={
                status === "voted"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              }
            >
              {status}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        cell: ({ row }) => {
          const voter = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleEditVoter(voter)}>
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleResendCode(voter)}>
                  Resend Code
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleDeleteVoter(voter)}
                  className="text-destructive"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [copiedId, handleCopyCode, handleEditVoter, handleResendCode, handleDeleteVoter]
  );

  const filteredData = useMemo(() => {
    return data.filter((voter) => {
      const matchesGlobal =
        !globalFilter ||
        voter.student_id.toLowerCase().includes(globalFilter.toLowerCase()) ||
        voter.email.toLowerCase().includes(globalFilter.toLowerCase());

      const matchesStatus =
        statusFilter === "ALL" || voter.code_status === statusFilter;

      return matchesGlobal && matchesStatus;
    });
  }, [data, globalFilter, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      {/* Header with filters and actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 flex-1 sm:flex-row sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by ID or email..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="voted">Voted</SelectItem>
              <SelectItem value="unsent">Unsent</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleAddVoter}
            size="sm"
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Voter
          </Button>
          <Button
            onClick={() => setIsImportOpen(true)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
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
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No voters found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      {/* Modals - Rendered unconditionally to prevent Radix body lock issues */}
      <AddEditVoterModal
        isOpen={isAddEditOpen}
        onClose={() => setIsAddEditOpen(false)}
        voter={selectedVoter ?? undefined}
      />
      <ImportVotersModal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
      />
      <DeleteVoterModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        voter={selectedVoter}
      />
    </div>
  );
}
