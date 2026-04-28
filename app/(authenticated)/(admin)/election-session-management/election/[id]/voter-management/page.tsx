"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle2, AlertCircle } from "lucide-react";
import { VoterTable } from "./_components/VoterTable";
import type { VoterTableRow } from "./_types/voter-types";

// Mock data - replace with actual API call
const mockVoters: VoterTableRow[] = [
  {
    id: "1",
    student_id: "STU001",
    email: "alice@example.com",
    voting_code: "VOTE-ABC-123",
    code_status: "sent",
  },
  {
    id: "2",
    student_id: "STU002",
    email: "bob@example.com",
    voting_code: "VOTE-DEF-456",
    code_status: "voted",
  },
  {
    id: "3",
    student_id: "STU003",
    email: "carol@example.com",
    voting_code: "VOTE-GHI-789",
    code_status: "sent",
  },
  {
    id: "4",
    student_id: "STU004",
    email: "david@example.com",
    voting_code: "VOTE-JKL-012",
    code_status: "voted",
  },
  {
    id: "5",
    student_id: "STU005",
    email: "emma@example.com",
    voting_code: "VOTE-MNO-345",
    code_status: "voted",
  },
];

export default function VoterManagementPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = React.use(params);

  // Calculate statistics
  const totalVoters = mockVoters.length;
  const votedCount = mockVoters.filter(
    (v) => v.code_status === "voted"
  ).length;
  const pendingCount = mockVoters.filter(
    (v) => v.code_status === "sent"
  ).length;
  const turnoutPercentage =
    totalVoters > 0 ? Math.round((votedCount / totalVoters) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Voter Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage voters and track voting status for election {id}
        </p>
      </div>

      {/* Summary Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Voters Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Voters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVoters}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered voters
            </p>
          </CardContent>
        </Card>

        {/* Voter Turnout Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Voter Turnout</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{turnoutPercentage}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {votedCount} of {totalVoters} voted
            </p>
          </CardContent>
        </Card>

        {/* Pending Codes Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Codes</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Codes not yet used
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Voters List</CardTitle>
        </CardHeader>
        <CardContent>
          <VoterTable voters={mockVoters} />
        </CardContent>
      </Card>
    </div>
  );
}