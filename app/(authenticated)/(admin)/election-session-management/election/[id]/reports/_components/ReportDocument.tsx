"use client";

import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { ReportData } from "../_queries/get-report-data";

interface ReportDocumentProps {
  data: ReportData;
}

export function ReportDocument({ data }: ReportDocumentProps) {
  const formattedDate = format(new Date(data.generated_at), "MMMM d, yyyy");
  const startDate = data.election.start_date
    ? format(new Date(data.election.start_date), "PPpp")
    : "Not specified";
  const endDate = data.election.end_date
    ? format(new Date(data.election.end_date), "PPpp")
    : "Not specified";

  return (
    <div className="bg-white text-black p-8 min-h-screen print:p-0 print:bg-white print:min-h-full">
      {/* Header Section */}
      <div className="mb-12 pb-6 border-b-2 border-gray-300 print:mb-8 print:pb-4">
        <h1 className="text-4xl font-bold mb-2 text-gray-900 print:text-3xl">
          Official Election Report
        </h1>
        <p className="text-lg font-semibold text-gray-800 mb-4 print:text-base">
          {data.election.title}
        </p>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-6 print:gap-2 print:mb-4">
          <div>
            <p className="font-semibold text-gray-900 print:text-xs">Voting Period</p>
            <p className="print:text-xs">Start: {startDate}</p>
            <p className="print:text-xs">End: {endDate}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 print:text-xs">Voter Turnout</p>
            <p className="text-2xl font-bold text-gray-900 mt-1 print:text-base">
              {data.voted_count} / {data.total_voters} ({data.turnout_percentage}%)
            </p>
          </div>
        </div>
      </div>

      {/* Position Tallies */}
      <div className="space-y-12 print:space-y-8">
        {data.positions.map((position) => (
          <div
            key={position.position_id}
            className="break-inside-avoid mb-8 page-break-inside-avoid print:mb-6"
          >
            {/* Position Header */}
            <div className="mb-4 pb-3 border-b border-gray-200 print:mb-2 print:pb-2">
              <h2 className="text-2xl font-bold text-gray-900 print:text-xl">
                {position.position_name}
              </h2>
              <p className="text-sm text-gray-600 print:text-xs">
                Seats Available: {position.seat_count}
              </p>
            </div>

            {/* Candidates Table */}
            {position.candidates.length > 0 ? (
              <div className="overflow-x-auto print:overflow-visible">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-300 print:border-gray-400">
                      <TableHead className="w-12 text-gray-900 print:bg-gray-100 print:text-xs">
                        Rank
                      </TableHead>
                      <TableHead className="text-gray-900 print:bg-gray-100 print:text-xs">
                        Candidate Name
                      </TableHead>
                      <TableHead className="text-right w-24 text-gray-900 print:bg-gray-100 print:text-xs">
                        Votes
                      </TableHead>
                      <TableHead className="text-center w-32 text-gray-900 print:bg-gray-100 print:text-xs">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {position.candidates.map((candidate, index) => (
                      <TableRow
                        key={candidate.id}
                        className={`border-gray-200 ${
                          candidate.isWinner
                            ? "bg-green-50/50 print:bg-transparent"
                            : ""
                        }`}
                      >
                        <TableCell className="font-semibold text-gray-900 print:text-xs">
                          #{index + 1}
                        </TableCell>
                        <TableCell className="text-gray-900 print:text-xs">
                          <div>
                            <div className="font-semibold">
                              {candidate.first_name} {candidate.last_name}
                              {candidate.suffix && ` ${candidate.suffix}`}
                            </div>
                            <div className="text-xs text-gray-600">
                              ({candidate.partylist_shorthand})
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-gray-900 font-semibold print:text-xs">
                          {candidate.vote_count.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center print:text-xs">
                          {candidate.isWinner ? (
                            <Badge
                              variant="default"
                              className="print:bg-gray-800 print:text-white print:text-xs"
                            >
                              Elected
                            </Badge>
                          ) : (
                            <span className="text-xs text-gray-500">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-600 italic text-sm print:text-xs">
                No candidates for this position.
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="mt-16 pt-8 border-t-2 border-gray-300 text-center text-xs text-gray-600 print:mt-8 print:pt-4 print:border-t print:text-xs">
        <p className="mb-2">
          Generated by Agora Election System securely on {formattedDate}.
        </p>
        <p>All votes were cast anonymously and tabulated with integrity.</p>
      </div>
    </div>
  );
}
