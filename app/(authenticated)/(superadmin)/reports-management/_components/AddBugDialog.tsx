import { useState } from "react";
import { BugReport, Severity } from "../_types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AddBugDialog = ({
  onAddBug,
}: {
  onAddBug: (bug: BugReport) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState("");
  const [severity, setSeverity] = useState<Severity>("Medium");
  const [details, setDetails] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary || !details) return;

    const newBug: BugReport = {
      id: Math.random().toString(36).substr(2, 9),
      summary,
      severity,
      details,
      submittedBy: "alice (you)",
      dateSubmitted: "Just now",
    };

    onAddBug(newBug);
    setIsOpen(false);

    setSummary("");
    setDetails("");
    setSeverity("Medium");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Updated border explicitly for light/dark mode */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center w-full">
        <DialogTrigger asChild>
          <button className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent-foreground hover:bg-accent ml-3 px-3 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded-md transition-colors cursor-pointer">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            Add item
          </button>
        </DialogTrigger>
      </div>

      {/* Added border override to the modal content itself */}
      <DialogContent className="sm:max-w-[425px] border border-neutral-300 dark:border-neutral-800">
        <DialogHeader>
          <DialogTitle>Add new bug report</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-muted-foreground">
              Summary
            </Label>
            {/* Replaced border-border with dark:border-neutral-700 */}
            <Input
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="e.g. App crashes on login"
              className="border border-neutral-300 dark:border-neutral-700 bg-background"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity" className="text-muted-foreground">
              Severity
            </Label>
            <Select
              value={severity}
              onValueChange={(val) => setSeverity(val as Severity)}
            >
              {/* Replaced border-border with dark:border-neutral-700 */}
              <SelectTrigger className="border border-neutral-300 dark:border-neutral-700 bg-background">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent className="border border-neutral-300 dark:border-neutral-700">
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details" className="text-muted-foreground">
              Details
            </Label>
            {/* Replaced border-border with dark:border-neutral-700 */}
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide steps to reproduce..."
              className="min-h-[100px] border border-neutral-300 dark:border-neutral-700 bg-background"
              required
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Bug</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
