"use client";

import React, { useState } from "react";
import Papa from "papaparse";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { importVotersCSVAction } from "../_actions/voter-actions";
import { toast } from "sonner";

interface ImportVotersModalProps {
  isOpen: boolean;
  onClose: () => void;
  electionId: string;
}

function checkForDuplicateEntries(voters: { student_id: string; email: string }[]): {
  hasDuplicates: boolean;
  message: string;
} {
  const studentIdSet = new Set<string>();
  const emailSet = new Set<string>();
  const duplicateStudentIds: string[] = [];
  const duplicateEmails: string[] = [];

  for (const voter of voters) {
    if (studentIdSet.has(voter.student_id)) {
      if (!duplicateStudentIds.includes(voter.student_id)) {
        duplicateStudentIds.push(voter.student_id);
      }
    } else {
      studentIdSet.add(voter.student_id);
    }

    if (emailSet.has(voter.email)) {
      if (!duplicateEmails.includes(voter.email)) {
        duplicateEmails.push(voter.email);
      }
    } else {
      emailSet.add(voter.email);
    }
  }

  if (duplicateStudentIds.length > 0 || duplicateEmails.length > 0) {
    let message = "Duplicate entries found in CSV file:\n\n";
    
    if (duplicateStudentIds.length > 0) {
      message += `Duplicate Student IDs: ${duplicateStudentIds.join(", ")}\n`;
    }
    
    if (duplicateEmails.length > 0) {
      message += `Duplicate Emails: ${duplicateEmails.join(", ")}`;
    }

    return {
      hasDuplicates: true,
      message: message.trim(),
    };
  }

  return { hasDuplicates: false, message: "" };
}

export function ImportVotersModal({
  isOpen,
  onClose,
  electionId,
}: ImportVotersModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) {
      return;
    }

    setErrorMsg(null);
    setIsPending(true);

    try {
      const fileContent = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result;
          if (typeof text === "string") {
            resolve(text);
          } else {
            reject(new Error("Failed to read file"));
          }
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsText(selectedFile);
      });

      const results = Papa.parse<Record<string, string>>(fileContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false,
      });

      if (results.errors && results.errors.length > 0) {
        console.error("Papa Parse errors:", results.errors);
        toast.error("Failed to parse CSV file. Please check the format.");  
        setErrorMsg("Failed to parse CSV file. Please check the format.");
        setIsPending(false);
        return;
      }

      const parsedData = results.data;

      if (!parsedData || parsedData.length === 0) {
        toast.error("CSV file is empty or has no valid data rows.");
        setErrorMsg("CSV file is empty or has no valid data rows.");
        setIsPending(false);
        return;
      }

      // 1. STRICT HEADER VALIDATION: Use 'in' to check if the column exists at all
      const firstRow = parsedData[0];
      if (!("student_id" in firstRow) || !("email" in firstRow)) {
        toast.error("CSV file is missing required headers.");
        setErrorMsg("CSV must contain exactly 'student_id' and 'email' as column headers.");
        setIsPending(false);
        return;
      }

      const sanitizedVoters: { student_id: string; email: string }[] = [];
      const incompleteRows: number[] = [];

      // 2. CONTENT VALIDATION: Check for empty cells in the rows
      for (let i = 0; i < parsedData.length; i++) {
        const row = parsedData[i];
        
        const studentId = row.student_id ? String(row.student_id).trim() : "";
        const email = row.email ? String(row.email).trim() : "";

        if (!studentId || !email) {
          // Add 2 because index 0 is row 2 in a spreadsheet (row 1 is the header)
          incompleteRows.push(i + 2);
        } else {
          sanitizedVoters.push({ student_id: studentId, email });
        }
      }

      // 3. ACCURATE ERROR REPORTING: Tell the user exactly which rows are missing data
      if (incompleteRows.length > 0) {
        const maxDisplay = 5;
        const rowList = incompleteRows.slice(0, maxDisplay).join(", ");
        const moreSuffix = incompleteRows.length > maxDisplay ? ` and ${incompleteRows.length - maxDisplay} more` : "";
        
        const errorMessage = `Incomplete data found. Both 'student_id' and 'email' must be filled out. Please fix row(s): ${rowList}${moreSuffix}.`;
        
        toast.error("Incomplete entries found in CSV.");
        setErrorMsg(errorMessage);
        setIsPending(false);
        return;
      }

      const duplicateCheck = checkForDuplicateEntries(sanitizedVoters);
      if (duplicateCheck.hasDuplicates) {
        toast.error("Duplicate entries found in CSV file. Please fix them and try again.");
        setErrorMsg(duplicateCheck.message);
        setIsPending(false);
        return;
      }

      const result = await importVotersCSVAction(
        electionId,
        sanitizedVoters
      );

      if (!result.success) {
        setErrorMsg(result.error || "Failed to import voters.");
        toast.error(result.error || "Failed to import voters.");
        setIsPending(false);
        return;
      }

      toast.success("Voters imported successfully!");
      setSelectedFile(null);
      setErrorMsg(null);
      setIsPending(false);
      onClose();
      window.location.reload(); 
    } catch (error) {
      console.error("Import error:", error);
      setErrorMsg("An error occurred while importing the file.");
      setIsPending(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setErrorMsg(null); 
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Import Voters from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple voters at once.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {errorMsg && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200 whitespace-pre-wrap">
              {errorMsg}
            </div>
          )}

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">Required CSV Headers:</p>
              <ul className="text-sm space-y-1 ml-4 list-disc">
                <li><code className="bg-muted px-1 py-0.5 rounded">student_id</code></li>
                <li><code className="bg-muted px-1 py-0.5 rounded">email</code></li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="grid gap-2">
            <Label htmlFor="csv-file">Select CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="cursor-pointer border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-colors"
              disabled={isPending}
            />
            {selectedFile && (
              <p className="text-sm text-muted-foreground">
                Selected: <span className="font-medium">{selectedFile.name}</span>
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport} 
            disabled={!selectedFile || isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              "Import"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}