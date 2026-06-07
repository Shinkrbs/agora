import {
  OrganizationsContainer,
} from "./_components";
import { getUserOrganizations } from "./_queries/organization-management-queries";

export default async function OrganizationManagementPage() {
  const organizations = await getUserOrganizations();
  return (
    <OrganizationsContainer organizations={organizations.organizations} />
  );
}
