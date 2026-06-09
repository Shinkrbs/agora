"use client";

import { fetchElectionsAction } from "./_actions/fetch-elections";
import { useCurrentOrganization } from "../_components/OrganizationContext";
import { ElectionSessionsList } from "./_components";
import { useEffect, useState } from "react";
import { ElectionCardSummary } from "./_types/election-card-type";
import { toast } from "sonner";

export default function ElectionSessionManagementPage() {
  const organization = useCurrentOrganization();
  const [elections, setElections] = useState<ElectionCardSummary[]>([]);

  useEffect(() => {
    async function fetchElections() {
      if (organization) {
        const result = await fetchElectionsAction(organization.id);
        
        if (result.error) {
          toast.error(result.error);
          setElections([]);
          return;
        }

        if (result.data) {
          setElections(result.data);
          if (result.message) {
            toast.success(result.message);
          }
        } else {
          setElections([]);
        }
      }
    }

    fetchElections();
  }, [organization]);

  return (
    <div className="space-y-6">
      <ElectionSessionsList initialElections={elections} />
    </div>
  );
}
