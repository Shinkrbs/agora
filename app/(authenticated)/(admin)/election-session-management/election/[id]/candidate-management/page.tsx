"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CandidateTable,
  AddEditCandidateModal,
  DeleteCandidateDialog,
} from "./_components";
import { CandidateTableRow } from "./_types/candidate-types";
import { fetchCandidatesAction, fetchPositionsAction, fetchPartylistsAction } from "./_actions/fetch-candidate-action";
import type { Position, Partylist } from "./_queries/candidate-queries";

export default function CandidateManagementPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);

  // State management
  const [candidates, setCandidates] = useState<CandidateTableRow[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<
    CandidateTableRow[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [positions, setPositions] = useState<Position[]>([]);
  const [partylists, setPartylists] = useState<Partylist[]>([]);

  // Modal states
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] =
    useState<CandidateTableRow | null>(null);

  // Fetch all data on mount
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [candidatesRes, positionsRes, partylistsRes] = await Promise.all([
          fetchCandidatesAction(id),
          fetchPositionsAction(id),
          fetchPartylistsAction(id),
        ]);

        if (candidatesRes.data) {
          setCandidates(candidatesRes.data);
          setFilteredCandidates(candidatesRes.data);
        } else {
          toast.error(candidatesRes.error || "Failed to load candidates");
        }

        if (positionsRes.data) {
          setPositions(positionsRes.data);
        } else {
          toast.error(positionsRes.error || "Failed to load positions");
        }

        if (partylistsRes.data) {
          setPartylists(partylistsRes.data);
        } else {
          toast.error(partylistsRes.error || "Failed to load partylists");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  // Filter candidates by search query
  useEffect(() => {
    const filtered = candidates.filter((candidate) =>
      candidate.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCandidates(filtered);
  }, [searchQuery, candidates]);

  // Handle add candidate
  const handleAddCandidate = () => {
    setSelectedCandidate(null);
    setAddEditModalOpen(true);
  };

  // Handle edit candidate
  const handleEditCandidate = (candidate: CandidateTableRow) => {
    setSelectedCandidate(candidate);
    setAddEditModalOpen(true);
  };

  // Handle delete candidate
  const handleDeleteCandidate = (candidate: CandidateTableRow) => {
    setSelectedCandidate(candidate);
    setDeleteDialogOpen(true);
  };

  // Handle successful add/edit
  const handleAddEditSuccess = async () => {
    setAddEditModalOpen(false);
    setIsLoading(true);
    try {
      const result = await fetchCandidatesAction(id);
      if (result.data) {
        setCandidates(result.data);
        setFilteredCandidates(result.data);
      } else {
        toast.error("Failed to reload candidates");
      }
    } catch (error) {
      console.error("Error reloading candidates:", error);
      toast.error("Failed to reload candidates");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful delete
  const handleDeleteSuccess = async () => {
    setDeleteDialogOpen(false);
    setIsLoading(true);
    try {
      const result = await fetchCandidatesAction(id);
      if (result.data) {
        setCandidates(result.data);
        setFilteredCandidates(result.data);
      } else {
        toast.error("Failed to reload candidates");
      }
    } catch (error) {
      console.error("Error reloading candidates:", error);
      toast.error("Failed to reload candidates");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Candidate Management
            </h2>
            <p className="text-muted-foreground text-sm">
              Manage candidates for election
            </p>
          </div>
          <Button onClick={handleAddCandidate} disabled={isLoading} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Candidate
          </Button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            placeholder="Search candidates by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
            disabled={isLoading}
          />
        </div>

        {/* Candidates Table */}
        <CandidateTable
          data={filteredCandidates}
          isLoading={isLoading}
          onEdit={handleEditCandidate}
          onDelete={handleDeleteCandidate}
          onSearch={setSearchQuery}
        />
      </div>

      {/* Add/Edit Modal */}
      <AddEditCandidateModal
        open={addEditModalOpen}
        onOpenChange={setAddEditModalOpen}
        candidate={selectedCandidate}
        positions={positions}
        partylists={partylists}
        electionId={id}
        onSuccess={handleAddEditSuccess}
      />

      {/* Delete Dialog */}
      <DeleteCandidateDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        candidate={selectedCandidate}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}