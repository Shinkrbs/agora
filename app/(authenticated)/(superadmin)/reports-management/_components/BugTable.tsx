import { BugReport, Severity } from "../_types/index";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Updated to match the responsive light/dark styles used in BugDetailsDialog
const getSeverityStyles = (severity: Severity) => {
  switch (severity) {
    case "High":
      return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20";
    case "Medium":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    case "Low":
      return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
    default:
      return "";
  }
};

interface BugTableProps {
  bugs: BugReport[];
  onRowClick: (bug: BugReport) => void;
}

export const BugTable = ({ bugs, onRowClick }: BugTableProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          {/* Replaced hardcoded borders/backgrounds with border-border, text-muted-foreground, and bg-muted */}
          <tr className="border-b border-border text-xs text-muted-foreground bg-muted/30">
            <th className="px-6 py-3 font-medium w-1/4">Summary</th>
            <th className="px-6 py-3 font-medium w-32">Severity</th>
            <th className="px-6 py-3 font-medium w-1/3">Details</th>
            <th className="px-6 py-3 font-medium w-48">Submitted by</th>
            <th className="px-6 py-3 font-medium whitespace-nowrap">Date</th>
          </tr>
        </thead>
        {/* Replaced divide-neutral-800/50 with divide-border */}
        <tbody className="divide-y divide-border">
          {bugs.map((bug) => (
            <tr
              key={bug.id}
              onClick={() => onRowClick(bug)}
              className="hover:bg-muted/50 transition-colors group cursor-pointer"
            >
              <td className="px-6 py-3">
                {/* Replaced text-gray-200 with text-foreground */}
                <span className="text-sm font-medium text-foreground">
                  {bug.summary}
                </span>
              </td>
              <td className="px-6 py-3">
                <Badge
                  variant="outline"
                  className={`font-medium rounded-md ${getSeverityStyles(
                    bug.severity,
                  )}`}
                >
                  {bug.severity}
                </Badge>
              </td>
              <td className="px-6 py-3">
                {/* Replaced text-gray-400 with text-muted-foreground */}
                <span className="text-sm text-muted-foreground truncate block max-w-xs">
                  {bug.details}
                </span>
              </td>
              <td className="px-6 py-3">
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    {/* Replaced bg-[#007A5A] text-white with standard bg-primary text-primary-foreground */}
                    <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                      {bug.submittedBy.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Replaced text-gray-300 with text-foreground */}
                  <span className="text-sm text-foreground">
                    {bug.submittedBy}
                  </span>
                </div>
              </td>
              <td className="px-6 py-3">
                {/* Replaced text-gray-400 with text-muted-foreground */}
                <span className="text-sm text-muted-foreground">
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
