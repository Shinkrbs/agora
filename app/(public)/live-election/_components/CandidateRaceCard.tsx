import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CandidateResult {
  id: string;
  firstName: string;
  lastName: string;
  partyName: string;
  voteCount: number;
  percentage: number;
  colorHex: string;
}

interface CandidateRaceCardProps {
  positionName: string;
  statusText?: string;
  candidates: CandidateResult[];
}

export function CandidateRaceCard({
  positionName,
  statusText,
  candidates,
}: CandidateRaceCardProps) {
  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">{positionName}</CardTitle>
        {statusText && (
          <Badge
            variant="secondary"
            className="bg-amber-100 text-amber-800 hover:bg-amber-100 font-medium"
          >
            {statusText}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-8 pt-4">
        {candidates.map((candidate) => (
          <div key={candidate.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                  style={{ backgroundColor: candidate.colorHex }}
                >
                  {candidate.firstName[0]}
                </div>
                <div>
                  <div className="font-bold text-lg">
                    {candidate.firstName} {candidate.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {candidate.partyName}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-xl">
                  {candidate.percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">
                  {candidate.voteCount.toLocaleString()} votes
                </div>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${candidate.percentage}%`,
                  backgroundColor: candidate.colorHex,
                }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
