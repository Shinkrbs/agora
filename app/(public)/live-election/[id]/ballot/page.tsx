import { getBallot } from "../_queries/get-ballot";
import { BallotContent } from "./_components/BallotForm";
import { AlertCircle } from "lucide-react";

interface BallotPageProps {
  params: Promise<{ id: string }>;
}

export default async function BallotPage({ params }: BallotPageProps) {
  const { id: electionId } = await params;

  const ballot = await getBallot(electionId);

  if (!ballot) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
          <p className="text-sm text-destructive">
            Error loading ballot. Please refresh the page or contact support.
          </p>
        </div>
      </div>
    );
  }

  return <BallotContent ballot={ballot} />;
}
