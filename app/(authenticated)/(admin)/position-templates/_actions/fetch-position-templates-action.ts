"use server";

import { fetchPositionTemplates as fetchTemplates } from "../_queries/fetch-position-templates";

export async function fetchPositionTemplatesAction(organizationId: string) {
    return await fetchTemplates(organizationId);
}