import { BugReport, Severity } from "../_types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Updated to use opacity utilities so it adapts to BOTH light and dark mode seamlessly
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
      {/* Removed hardcoded background and border; fallback to shadcn's default styling */}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          {/* Replaced text-white with standard foreground inheritance */}
          <DialogTitle className="text-xl font-semibold mb-2">
            {bug.summary}
          </DialogTitle>
          {/* Replaced border-neutral-800 with border-border */}
          <div className="flex items-center gap-3 pb-4 border-b border-border">
            <Badge
              variant="outline"
              className={getSeverityStyles(bug.severity)}
            >
              {bug.severity}
            </Badge>
            {/* Replaced text-gray-500 with text-muted-foreground */}
            <span className="text-sm text-muted-foreground">
              {bug.dateSubmitted}
            </span>
          </div>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div>
            {/* Replaced text-gray-500 with text-muted-foreground */}
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Description
            </h4>
            {/* Replaced text-gray-300 with text-foreground */}
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              {bug.details}
            </p>
          </div>

          <div>
            {/* Replaced text-gray-500 with text-muted-foreground */}
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Reporter
            </h4>
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                {/* Automatically uses your --primary green color for the avatar fallback */}
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                  {bug.submittedBy.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* Replaced text-gray-300 with text-foreground */}
              <span className="text-sm font-medium text-foreground">
                {bug.submittedBy}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
