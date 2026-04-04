import {
  OrganizationsHeader,
  OrganizationsGrid,
} from "./_components";
import { getUserOrganizations } from "./_queries/organization-management-queries";

export default async function OrganizationManagementPage() {
  const organizations = await getUserOrganizations();
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <OrganizationsHeader />
        <OrganizationsGrid organizations={organizations.organizations} />
      </div>
    </div>
  );
}
