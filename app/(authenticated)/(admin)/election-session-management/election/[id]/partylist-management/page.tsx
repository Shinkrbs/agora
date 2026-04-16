"use client";

import { use, useEffect, useState } from "react";
import { fetchPartylists } from "./_actions/fetch-partylists-action";
import { PartylistWithCandidateCount } from "./_types/partylist-types";
import { PartylistCard, DeletePartylistModal } from "./_components";

export default function PartylistManagementPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);
  const [partylists, setPartylists] = useState<PartylistWithCandidateCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPartylist, setSelectedPartylist] = useState<PartylistWithCandidateCount | null>(null);

  useEffect(() => {
    async function hanldeFetchPartylists() {
      setIsLoading(true);
      const partylistsData = await fetchPartylists(id);
      if (partylistsData.data) {
        setPartylists(partylistsData.data);
      } else {
        console.error("Error fetching partylists:", partylistsData.error);
      }
      setIsLoading(false);
    }
    hanldeFetchPartylists();
  }, [id]);

  const handleEdit = (partylist: PartylistWithCandidateCount) => {
    console.log("Edit partylist:", partylist);
    // TODO: Implement edit functionality
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
    </div>
  );
}