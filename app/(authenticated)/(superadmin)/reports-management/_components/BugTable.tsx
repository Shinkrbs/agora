import { BugReport, Severity } from "../_types/index";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Helper function to map severity to specific dark-theme tailwind classes
const getSeverityStyles = (severity: Severity) => {
  switch (severity) {
    case "High":
      return "bg-red-950 text-red-400 border-red-400/20";
    case "Medium":
      return "bg-amber-950 text-amber-400 border-amber-400/20";
    case "Low":
      return "bg-green-950 text-green-400 border-green-400/20";
    default:
      return "";
  }
};

interface BugTableProps {
  bugs: BugReport[];
  onRowClick: (bug: BugReport) => void;
}

// FIX: Destructure onRowClick and apply the BugTableProps interface
export const BugTable = ({ bugs, onRowClick }: BugTableProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-neutral-800/80 text-xs text-gray-400 bg-[#171717]">
            <th className="px-6 py-3 font-medium w-1/4">Summary</th>
            <th className="px-6 py-3 font-medium w-32">Severity</th>
            <th className="px-6 py-3 font-medium w-1/3">Details</th>
            <th className="px-6 py-3 font-medium w-48">Submitted by</th>
            <th className="px-6 py-3 font-medium whitespace-nowrap">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/50">
          {bugs.map((bug) => (
            <tr
              key={bug.id}
              onClick={() => onRowClick(bug)} // This will now work perfectly
              className="hover:bg-[#1A1A1A] transition-colors group cursor-pointer"
            >
              <td className="px-6 py-3">
                <span className="text-sm font-medium text-gray-200">
                  {bug.summary}
                </span>
              </td>
              <td className="px-6 py-3">
                <Badge
                  variant="outline"
                  className={`font-medium rounded-md ${getSeverityStyles(bug.severity)}`}
                >
                  {bug.severity}
                </Badge>
              </td>
              <td className="px-6 py-3">
                <span className="text-sm text-gray-400 truncate block max-w-xs">
                  {bug.details}
                </span>
              </td>
              <td className="px-6 py-3">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-[#007A5A] text-white text-[10px] font-bold">
                      {bug.submittedBy.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-300">
                    {bug.submittedBy}
                  </span>
                </div>
              </td>
              <td className="px-6 py-3">
                <span className="text-sm text-gray-400">
                  {bug.dateSubmitted}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
