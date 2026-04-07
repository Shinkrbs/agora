"use server";

import { getElectionSessionsByOrganizationId as fetchElections } from "@/lib/queries/elections-queries";

export async function fetchElectionsAction(organizationId: string) {
  return await fetchElections(organizationId);
}
