import { ElectionSessionsList } from "./_components";
import { dummyElections } from "./_data/dummy-elections";

export default function ElectionSessionManagementPage() {
  return (
    <div className="space-y-6">
      <ElectionSessionsList initialElections={dummyElections} />
    </div>
  );
}
