"use client";

import { useOrganization } from "./OrganizationContext";
import { OrganizationSwitchingLoader } from "./OrganizationSwitchingLoader";

export function AdminChildrenLoadingOverlay() {
  const { isLoading } = useOrganization();

  if (!isLoading) {
    return null;
  }

  return <OrganizationSwitchingLoader />;
}
