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
      id: Math.random().toString(36).substr(2, 9), // Simple ID generator
      summary,
      severity,
      details,
      submittedBy: "alice (you)", // Mocked current user
      dateSubmitted: "Just now",
    };

    onAddBug(newBug);
    setIsOpen(false);

    // Reset form
    setSummary("");
    setDetails("");
    setSeverity("Medium");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* This triggers the modal from the bottom of the table */}
        <div className="p-3 border-t border-neutral-800/80 bg-[#171717] hover:bg-[#1E1E1E] transition-colors cursor-pointer flex items-center group w-full">
          <button className="flex items-center gap-2 text-sm font-medium text-gray-400 group-hover:text-gray-200 ml-3">
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
        </div>
      </DialogTrigger>

      <DialogContent className="bg-[#141414] border-neutral-800 text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-white">Add new bug report</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-gray-400">
              Summary
            </Label>
            <Input
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="e.g. App crashes on login"
              className="bg-[#121212] border-neutral-700 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="severity" className="text-gray-400">
              Severity
            </Label>
            <Select
              value={severity}
              onValueChange={(val) => setSeverity(val as Severity)}
            >
              <SelectTrigger className="bg-[#121212] border-neutral-700 text-white">
                <SelectValue placeholder="Select severity" />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1E1E] border-neutral-700 text-white">
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="details" className="text-gray-400">
              Details
            </Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide steps to reproduce..."
              className="bg-[#121212] border-neutral-700 text-white min-h-[100px]"
              required
            />
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsOpen(false)}
              className="hover:bg-neutral-800 hover:text-white text-gray-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#007A5A] hover:bg-[#00634A] text-white"
            >
              Save Bug
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
