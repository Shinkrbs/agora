"use server";

import { getElectionsByOrganization as fetchElections } from "../_queries/election-sessions";

export async function fetchElectionsAction(organizationId: string) {
  return await fetchElections(organizationId);
}
