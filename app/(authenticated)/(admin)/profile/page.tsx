import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/queries/users-queries";
import { ProfileEditor } from "./_components/ProfileEditor";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="w-full">
      <ProfileEditor
        initialData={{
          userId: user.id,
          role: user.role,
          username: user.username ?? "",
          first_name: user.first_name ?? "",
          last_name: user.last_name ?? "",
          middle_name: user.middle_name,
          suffix: user.suffix,
          email: user.email ?? "",
          avatar_url: user.avatar_url ?? "",
          created_at: user.created_at,
          updated_at: user.updated_at,
        }}
      />
    </div>
  );
}
