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

interface ImportVotersModalProps {
  isOpen: boolean;
  onClose: () => void;
  electionId: string;
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
      Papa.parse(selectedFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results: Papa.ParseResult<Record<string, string>>) => {
          try {
            const parsedData = results.data;

            if (!parsedData || parsedData.length === 0) {
              setErrorMsg("CSV file is empty or has no valid data rows.");
              setIsPending(false);
              return;
            }

            const firstRow = parsedData[0];
            if (!firstRow.student_id || !firstRow.email) {
              setErrorMsg(
                "CSV must contain 'student_id' and 'email' columns."
              );
              setIsPending(false);
              return;
            }

            const sanitizedVoters = parsedData.map((row) => ({
              student_id: row.student_id.trim(),
              email: row.email.trim(),
            }));

            const result = await importVotersCSVAction(
              electionId,
              sanitizedVoters
            );

            if (!result.success) {
              setErrorMsg(result.error || "Failed to import voters.");
              setIsPending(false);
              return;
            }

            setSelectedFile(null);
            setErrorMsg(null);
            setIsPending(false);
            onClose();
          } catch (error) {
            console.error("Parse completion error:", error);
            setErrorMsg("An error occurred while processing the CSV.");
            setIsPending(false);
          }
        },
        error: (error: Papa.ParseError) => {
          console.error("Papa Parse error:", error);
          setErrorMsg("Failed to parse CSV file. Please check the format.");
          setIsPending(false);
        },
      });
    } catch (error) {
      console.error("File reading error:", error);
      setErrorMsg("An error occurred while reading the file.");
      setIsPending(false);
    }
  };;

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Import Voters from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file to import multiple voters at once.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {errorMsg && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">
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
              className="cursor-pointer"
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
