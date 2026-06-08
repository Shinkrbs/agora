"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { fetchPartylists } from "./_actions/fetch-partylists-action";
import { editPartylist } from "./_actions/edit-partylist";
import { PartylistWithCandidateCount } from "./_types/partylist-types";
import { PartylistCard, DeletePartylistModal, EditPartylistModal, CreatePartylistModal } from "./_components";
import { Candidate } from "@/types/database";
import { fetchCandidatesAction } from "@/lib/actions/candidates";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrganization } from "@/app/(authenticated)/(admin)/_components/OrganizationContext";

export default function PartylistManagementPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);
  const { currentOrganization } = useOrganization();
  const [partylists, setPartylists] = useState<PartylistWithCandidateCount[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPartylist, setSelectedPartylist] = useState<PartylistWithCandidateCount | null>(null);

  useEffect(() => {
    async function handleFetchPartylists() {
      setIsLoading(true);
      const partylistsData = await fetchPartylists(id);
      if (partylistsData.data) {
        setPartylists(partylistsData.data);
      } else {
        toast.error(partylistsData.error || "Failed to load partylists");
      }
    }
    async function handleFetchCandidates() {
      setIsLoading(true);
      const cadidatesData = await fetchCandidatesAction(id);
      if (cadidatesData.data) {
        setCandidates(cadidatesData.data);
      } else {
        toast.error(cadidatesData.error || "Failed to load candidates");
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
      toast.error(partylistsData.error || "Failed to reload partylists");
    }
    setIsLoading(false);
  };

  const handleEditSave = async (data: {
    name: string;
    description: string;
    addedMemberIds: string[];
    removedMemberIds: string[];
    logoFile?: File | null;
  }) => {
    if (!selectedPartylist || !currentOrganization) return;

    try {
      const result = await editPartylist({
        partylistId: selectedPartylist.id,
        organizationId: currentOrganization.id,
        electionId: id,
        name: data.name,
        description: data.description,
        addedMemberIds: data.addedMemberIds,
        removedMemberIds: data.removedMemberIds,
        logoFile: data.logoFile || null,
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
          toast.error(partylistsData.error || "Failed to reload partylists");
        }

        if (candidatesData.data) {
          setCandidates(candidatesData.data);
        } else {
          toast.error(candidatesData.error || "Failed to reload candidates");
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

  const handleCreateSuccess = async () => {
    // Refetch partylists after successful creation
    setIsLoading(true);
    const partylistsData = await fetchPartylists(id);
    if (partylistsData.data) {
      setPartylists(partylistsData.data);
    } else {
      console.error("Error fetching partylists:", partylistsData.error);
    }
    setIsLoading(false);
  };

  // Filter partylists based on search query
  const filteredPartylists = partylists.filter((partylist) =>
    partylist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partylist.shorthand_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Partylist Management</h2>
        <p className="text-muted-foreground text-sm mb-4">
          Manage partylists for election
        </p>

        {/* Search Bar and Create Button */}
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search by name or shorthand..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={() => setCreateModalOpen(true)}
            disabled={isLoading || !currentOrganization}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Partylist
          </Button>
        </div>

        {isLoading ? (
          <div className="mt-4 text-muted-foreground text-sm">
            Loading partylists...
          </div>
        ) : partylists.length === 0 ? (
          <div className="mt-4 text-muted-foreground text-sm">
            No partylists found for this election.
          </div>
        ) : filteredPartylists.length === 0 ? (
          <div className="mt-4 text-muted-foreground text-sm">
            No partylists match your search.
          </div>
        ) : (
          <div className="grid gap-4 mt-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredPartylists.map((partylist) => (
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

      <CreatePartylistModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        organizationId={currentOrganization?.id || ""}
        electionId={id}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
}