"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchPartylists } from "./_actions/fetch-partylists-action";
import { editPartylist } from "./_actions/edit-partylist";
import { PartylistWithCandidateCount } from "./_types/partylist-types";
import { PartylistCard, DeletePartylistModal, EditPartylistModal } from "./_components";
import { Candidate } from "@/types/database";
import { fetchCandidatesAction } from "@/lib/actions/candidates";

export default function PartylistManagementPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);
  const [partylists, setPartylists] = useState<PartylistWithCandidateCount[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedPartylist, setSelectedPartylist] = useState<PartylistWithCandidateCount | null>(null);

  useEffect(() => {
    async function handleFetchPartylists() {
      setIsLoading(true);
      const partylistsData = await fetchPartylists(id);
      if (partylistsData.data) {
        setPartylists(partylistsData.data);
      } else {
        console.error("Error fetching partylists:", partylistsData.error);
      }
    }
    async function handleFetchCandidates() {
      setIsLoading(true);
      const cadidatesData = await fetchCandidatesAction(id);
      if (cadidatesData.data) {
        setCandidates(cadidatesData.data);
      } else {
        console.error("Error fetching candidates:", cadidatesData.error);
      }
      setIsLoading(false);
    }
    handleFetchPartylists();
    handleFetchCandidates();
  }, [id]);

  const handleEdit = (partylist: PartylistWithCandidateCount) => {
    setSelectedPartylist(partylist);
    setEditModalOpen(true);
  };

  const handleDelete = (partylistId: string) => {
    const partylist = partylists.find((p) => p.id === partylistId) || null;
    setSelectedPartylist(partylist);
    setDeleteModalOpen(true);
  };

  const handleDeleteSuccess = async () => {
    // Refetch partylists after successful deletion
    setIsLoading(true);
    const partylistsData = await fetchPartylists(id);
    if (partylistsData.data) {
      setPartylists(partylistsData.data);
    } else {
      console.error("Error fetching partylists:", partylistsData.error);
    }
    setIsLoading(false);
  };

  const handleEditSave = async (data: {
    name: string;
    description: string;
    addedMemberIds: string[];
    removedMemberIds: string[];
  }) => {
    if (!selectedPartylist) return;

    try {
      const result = await editPartylist({
        partylistId: selectedPartylist.id,
        name: data.name,
        description: data.description,
        addedMemberIds: data.addedMemberIds,
        removedMemberIds: data.removedMemberIds,
      });

      if (result.success) {
        toast.success(`Partylist "${data.name}" updated successfully!`);
        // Refetch partylists and candidates after successful edit
        setIsLoading(true);
        const [partylistsData, candidatesData] = await Promise.all([
          fetchPartylists(id),
          fetchCandidatesAction(id),
        ]);

        if (partylistsData.data) {
          setPartylists(partylistsData.data);
        } else {
          console.error("Error fetching partylists:", partylistsData.error);
        }

        if (candidatesData.data) {
          setCandidates(candidatesData.data);
        } else {
          console.error("Error fetching candidates:", candidatesData.error);
        }

        setIsLoading(false);
      } else {
        toast.error(result.error || "Failed to update partylist");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Edit error:", error);
    }
  };
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Partylist Management</h2>
        <p className="text-muted-foreground text-sm">
          Manage partylists for election ID: {id}
        </p>

        {isLoading ? (
          <div className="mt-4 text-muted-foreground text-sm">
            Loading partylists...
          </div>
        ) : partylists.length === 0 ? (
          <div className="mt-4 text-muted-foreground text-sm">
            No partylists found for this election.
          </div>
        ) : (
          <div className="grid gap-4 mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {partylists.map((partylist) => (
              <PartylistCard
                key={partylist.id}
                partylist={partylist}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <DeletePartylistModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        partylist={selectedPartylist}
        onSuccess={handleDeleteSuccess}
      />

      <EditPartylistModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        partylist={selectedPartylist}
        candidates={candidates}
        onSave={handleEditSave}
      />
    </div>
  );
}