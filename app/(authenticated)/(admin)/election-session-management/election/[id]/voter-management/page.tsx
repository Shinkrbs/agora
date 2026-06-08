"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle2, AlertCircle } from "lucide-react";
import { VoterTable } from "./_components/VoterTable";
import type { VoterTableRow } from "./_types/voter-types";
import { fetchVoters } from "./_queries/voter-queries";
import { ElectionSession } from "@/types/database";
import { fetchElectionSessionAction } from "@/lib/actions/elections";

export default function VoterManagementPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = React.use(params);
  const [voters, setVoters] = useState<VoterTableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [election, setElection] = useState<ElectionSession | null>(null);

  // COMBINED FETCH: Runs both requests in parallel and only stops loading when BOTH finish.
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [electionResponse, votersResponse] = await Promise.all([
          fetchElectionSessionAction(id),
          fetchVoters(id)
        ]);

        if (electionResponse.error) {
          setError(electionResponse.error);
        } else {
          setElection(electionResponse.data || null);
        }

        if (votersResponse.error) {
          setError(votersResponse.error);
        } else if (votersResponse.data) {
          const voterTableRows: VoterTableRow[] = votersResponse.data.map((voter) => ({
            id: voter.id,
            student_id: voter.student_id,
            email: voter.email,
            voting_code: voter.voting_code,
            election_id: id,
            code_status: voter.code_status,
          }));
          setVoters(voterTableRows);
        }
      } catch (err) {
        setError("Failed to load page data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleVoterAdded = () => {
    const loadVoters = async () => {
      try {
        const { data, error: fetchError } = await fetchVoters(id);

        if (fetchError) {
          setError(fetchError);
          return;
        }

        if (data) {
          const voterTableRows: VoterTableRow[] = data.map((voter) => ({
            id: voter.id,
            student_id: voter.student_id,
            email: voter.email,
            voting_code: voter.voting_code,
            election_id: id,
            code_status: voter.code_status,
          }));
          setVoters(voterTableRows);
        }
      } catch (err) {
        setError("Failed to load voters");
      }
    };
    loadVoters();
  };

  const totalVoters = voters.length;
  const votedCount = voters.filter((v) => v.code_status === "VOTED").length;
  const pendingCount = voters.filter((v) => v.code_status === "SENT").length;
  const turnoutPercentage = totalVoters > 0 ? Math.round((votedCount / totalVoters) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Voter Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage voters and track voting status
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

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
          {isLoading ? (
            <p className="text-muted-foreground">Loading voters...</p>
          ) : (
            <VoterTable voters={voters} electionId={id} onVoterAdded={handleVoterAdded} election={election} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}