"use client";

import { use, useEffect, useState } from "react";
import { fetchPartylists } from "./_actions/fetch-partylists-action";
import { PartylistWithCandidateCount } from "./_types/partylist-types";

export default function PartylistManagementPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = use(params);
  const [partylists, setPartylists] = useState<PartylistWithCandidateCount[]>([]);

  useEffect(() => {
    async function hanldeFetchPartylists() {
      const partylistsData = await fetchPartylists(id);
      if (partylistsData.data) {
        setPartylists(partylistsData.data);
      } else {
        console.error("Error fetching partylists:", partylistsData.error);
      }
    }
    hanldeFetchPartylists();
  }, []);
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Partylist Management</h2>
        <p className="text-muted-foreground text-sm">
          Manage partylists for election ID: {id}
        </p>
        <p className="text-muted-foreground text-sm mt-4">
          Partylist management content coming soon...
        </p>
        <div className="space-y-4 mt-4">
          {partylists.map((partylist) => (
            <div key={partylist.id} className="border border-border rounded-lg p-4">
              <h3 className="text-lg font-semibold text-foreground">
                {partylist.name}
              </h3>
              <p className="text-muted-foreground text-sm">
                Candidates: {partylist.candidate_count}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}