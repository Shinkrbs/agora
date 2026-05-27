import { getElectionSessionById } from "@/lib/queries/elections-queries";
import { getReportData } from "./_queries/get-report-data";
import { ReportView, OngoingElectionFallback } from "./_components";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default async function ReportsPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;

  // Fetch election session to check status
  const election = await getElectionSessionById(id);

  if (!election) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6 flex justify-center">
            <AlertCircle className="w-16 h-16 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Election Not Found
          </h2>
          <p className="text-gray-600">
            The election session could not be found. Please verify the election
            ID and try again.
          </p>
        </Card>
      </div>
    );
  }

  // Check if election is completed
  if (election.status !== "completed") {
    return <OngoingElectionFallback />;
  }

  // Fetch report data for completed election
  const reportData = await getReportData(id);

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="mb-6 flex justify-center">
            <AlertCircle className="w-16 h-16 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Report
          </h2>
          <p className="text-gray-600">
            Could not load the election report. Please try again later.
          </p>
        </Card>
      </div>
    );
  }

  return <ReportView data={reportData} electionId={id} />;
}