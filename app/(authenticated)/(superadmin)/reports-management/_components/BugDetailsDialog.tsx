import { BugReport, Severity } from "../_types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Helper function to handle the colors safely
const getSeverityStyles = (severity: Severity) => {
  switch (severity) {
    case "High":
      return "bg-[#5C1D2A] text-[#FF8DA1] border-[#FF8DA1]/20";
    case "Medium":
      return "bg-[#3E1B5A] text-[#D09CFA] border-[#D09CFA]/20";
    case "Low":
      return "bg-[#1A3B5C] text-[#8AC3FF] border-[#8AC3FF]/20";
    default:
      return "";
  }
};

interface BugDetailsDialogProps {
  bug: BugReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BugDetailsDialog = ({
  bug,
  isOpen,
  onClose,
}: BugDetailsDialogProps) => {
  if (!bug) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#141414] border-neutral-800 text-gray-200 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white mb-2">
            {bug.summary}
          </DialogTitle>
          <div className="flex items-center gap-3 pb-4 border-b border-neutral-800/80">
            {/* Replaced the object lookup with the safe helper function */}
            <Badge
              variant="outline"
              className={getSeverityStyles(bug.severity)}
            >
              {bug.severity}
            </Badge>
            <span className="text-sm text-gray-500">{bug.dateSubmitted}</span>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Description
            </h4>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
              {bug.details}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Reporter
            </h4>
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-[#007A5A] text-white text-xs font-bold">
                  {bug.submittedBy.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-300">
                {bug.submittedBy}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
