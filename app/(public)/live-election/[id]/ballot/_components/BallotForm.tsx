"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertCircle, ChevronDown, ChevronUp, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { BallotData } from "@/types/ballot";
import { submitBallotAction } from "../../_actions/submit-ballot";

interface BallotPageProps {
  ballot: BallotData;
}

interface VoteState {
  [positionId: string]: string | string[];
}

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

export function BallotContent({ ballot }: BallotPageProps) {
  const router = useRouter();
  const [votes, setVotes] = useState<VoteState>({});
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>("idle");
  const [submissionError, setSubmissionError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedPosition, setExpandedPosition] = useState<string | null>(
    ballot.positions.length > 0 ? ballot.positions[0].id : null,
  );

  const handleRadioChange = (positionId: string, candidateId: string) => {
    setVotes((prev) => ({
      ...prev,
      [positionId]: candidateId,
    }));
  };

  const handleAbstain = (positionId: string, checked: boolean) => {
    setVotes((prev) => {
      if (checked) {
        return {
          ...prev,
          [positionId]: "ABSTAIN",
        };
      } else {
        const newState = { ...prev };
        delete newState[positionId];
        return newState;
      }
    });
  };

  const handleCheckboxChange = (
    positionId: string,
    candidateId: string,
    checked: boolean,
    seatCount: number,
  ) => {
    setVotes((prev) => {
      const currentVotes = Array.isArray(prev[positionId])
        ? (prev[positionId] as string[])
        : [];

      if (checked) {
        if (currentVotes.length >= seatCount) {
          alert(`You can only select up to ${seatCount} candidate${seatCount > 1 ? "s" : ""} for this position.`);
          return prev;
        }
        return {
          ...prev,
          [positionId]: [...currentVotes, candidateId],
        };
      } else {
        return {
          ...prev,
          [positionId]: currentVotes.filter((id) => id !== candidateId),
        };
      }
    });
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (submissionStatus === "submitting" || submissionStatus === "success") return;

    setSubmissionStatus("submitting");
    setSubmissionError("");
    setIsModalOpen(true);

    try {
      await submitBallotAction(ballot.electionId, votes);
      setSubmissionStatus("success");

      // Redirect after showing success for a moment
      setTimeout(() => {
        router.push(`/live-election/${ballot.electionId}?success=true`);
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setSubmissionError(errorMessage);
      setSubmissionStatus("error");
    }
  }, [submissionStatus, ballot.electionId, votes, router]);

  const handleModalClose = (open: boolean) => {
    // Only allow closing on error state
    if (!open && submissionStatus === "error") {
      setIsModalOpen(false);
      setSubmissionStatus("idle");
    }
  };

  const handleRetry = () => {
    setIsModalOpen(false);
    setSubmissionStatus("idle");
    setSubmissionError("");
  };

  const allPositionsSelected = ballot.positions.every((position) => {
    const vote = votes[position.id];
    if (vote === "ABSTAIN") return true;

    if (position.seatCount === 1) {
      return typeof vote === "string" && vote.length > 0;
    } else {
      return Array.isArray(vote) && vote.length > 0;
    }
  });

  const isSubmitDisabled =
    !allPositionsSelected ||
    submissionStatus === "submitting" ||
    submissionStatus === "success";

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Voting Instructions:</strong> Select one candidate per position (unless
            otherwise noted). Review your selections carefully before submitting.
          </p>
        </div>

        <div className="space-y-4">
          {ballot.positions.length > 0 ? (
            ballot.positions.map((position) => {
              const isExpanded = expandedPosition === position.id;
              const isMultiVote = position.seatCount > 1;
              const selectedVotes = votes[position.id];
              const selectedCount = Array.isArray(selectedVotes)
                ? selectedVotes.length
                : selectedVotes && selectedVotes !== "ABSTAIN"
                  ? 1
                  : 0;

              return (
                <Card key={position.id} className="shadow-sm">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedPosition(isExpanded ? null : position.id)
                    }
                    className="w-full text-left hover:bg-muted/50 transition-colors"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{position.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {isMultiVote ? (
                              <span>
                                Select up to {position.seatCount} candidate
                                {position.seatCount > 1 ? "s" : ""} •{" "}
                                <span
                                  className={
                                    selectedVotes === "ABSTAIN"
                                      ? "font-medium text-amber-600 dark:text-amber-400"
                                      : selectedCount > 0
                                        ? "font-medium text-green-600 dark:text-green-400"
                                        : "text-muted-foreground"
                                  }
                                >
                                  {selectedVotes === "ABSTAIN" ? "Abstained" : `${selectedCount} selected`}
                                </span>
                              </span>
                            ) : (
                              <span>
                                Select one candidate •{" "}
                                <span
                                  className={
                                    selectedVotes === "ABSTAIN"
                                      ? "font-medium text-amber-600 dark:text-amber-400"
                                      : selectedCount > 0
                                        ? "font-medium text-green-600 dark:text-green-400"
                                        : "text-muted-foreground"
                                  }
                                >
                                  {selectedVotes === "ABSTAIN" ? "Abstained" : selectedCount > 0 ? "Selected" : "Not selected"}
                                </span>
                              </span>
                            )}
                          </CardDescription>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
                        )}
                      </div>
                    </CardHeader>
                  </button>

                  {isExpanded && (
                    <CardContent className="space-y-4 border-t border-border pt-4">
                      {isMultiVote ? (
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors bg-muted/20">
                            <Checkbox
                              id={`abstain-${position.id}`}
                              checked={selectedVotes === "ABSTAIN"}
                              onCheckedChange={(checked) =>
                                handleAbstain(position.id, checked as boolean)
                              }
                              className="mt-1"
                            />
                            <Label
                              htmlFor={`abstain-${position.id}`}
                              className="flex-1 cursor-pointer"
                            >
                              <div className="font-medium italic text-muted-foreground">
                                Abstain
                              </div>
                              <div className="text-sm text-muted-foreground">
                                I choose not to vote for this position
                              </div>
                            </Label>
                          </div>
                          {position.candidates.map((candidate) => {
                            const isSelected = Array.isArray(selectedVotes)
                              ? selectedVotes.includes(candidate.id)
                              : false;

                            return (
                              <div
                                key={candidate.id}
                                className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                              >
                                <Checkbox
                                  id={candidate.id}
                                  checked={isSelected}
                                  onCheckedChange={(checked) =>
                                    handleCheckboxChange(
                                      position.id,
                                      candidate.id,
                                      checked as boolean,
                                      position.seatCount,
                                    )
                                  }
                                  className="mt-1"
                                />
                                <Label
                                  htmlFor={candidate.id}
                                  className="flex-1 cursor-pointer"
                                >
                                  <div className="font-medium">
                                    {candidate.firstName} {candidate.lastName}
                                  </div>
                                  {candidate.partyName && (
                                    <div className="text-sm text-muted-foreground">
                                      {candidate.partyName}
                                    </div>
                                  )}
                                </Label>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <RadioGroup
                          value={(votes[position.id] as string) || ""}
                          onValueChange={(value) =>
                            handleRadioChange(position.id, value)
                          }
                        >
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors bg-muted/20">
                              <RadioGroupItem
                                value="ABSTAIN"
                                id={`abstain-${position.id}`}
                                className="mt-1"
                              />
                              <Label
                                htmlFor={`abstain-${position.id}`}
                                className="flex-1 cursor-pointer"
                              >
                                <div className="font-medium italic text-muted-foreground">
                                  Abstain
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  I choose not to vote for this position
                                </div>
                              </Label>
                            </div>
                            {position.candidates.map((candidate) => (
                              <div
                                key={candidate.id}
                                className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                              >
                                <RadioGroupItem
                                  value={candidate.id}
                                  id={candidate.id}
                                  className="mt-1"
                                />
                                <Label
                                  htmlFor={candidate.id}
                                  className="flex-1 cursor-pointer"
                                >
                                  <div className="font-medium">
                                    {candidate.firstName} {candidate.lastName}
                                  </div>
                                  {candidate.partyName && (
                                    <div className="text-sm text-muted-foreground">
                                      {candidate.partyName}
                                    </div>
                                  )}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      )}
                    </CardContent>
                  )}
                </Card>
              );
            })
          ) : (
            <Card className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <AlertCircle className="h-5 w-5" />
                  <p>No positions available for this election.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {ballot.positions.length > 0 && (
          <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-900 dark:text-amber-100">
              <strong>Review your selections:</strong> Make sure you&apos;ve selected candidates or chosen to abstain for
              each position. You cannot change your vote after submission.
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitDisabled}
            className="flex-1"
          >
            {submissionStatus === "submitting" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Review & Submit Ballot"
            )}
          </Button>
        </div>
      </form>

      {/* Ballot Submission Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent
          showCloseButton={submissionStatus === "error"}
          className="sm:max-w-md"
          onPointerDownOutside={(e) => {
            // Prevent closing while submitting or on success
            if (submissionStatus !== "error") {
              e.preventDefault();
            }
          }}
          onEscapeKeyDown={(e) => {
            if (submissionStatus !== "error") {
              e.preventDefault();
            }
          }}
        >
          {/* Submitting State */}
          {submissionStatus === "submitting" && (
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute h-16 w-16 rounded-full border-4 border-primary/20" />
                <Loader2 className="h-16 w-16 text-primary animate-spin" />
              </div>
              <DialogHeader className="items-center text-center">
                <DialogTitle className="text-xl">Submitting Your Ballot</DialogTitle>
                <DialogDescription className="text-center">
                  Please wait while we securely record your votes. Do not close this page.
                </DialogDescription>
              </DialogHeader>
              <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary h-full rounded-full animate-pulse"
                  style={{ width: "70%" }}
                />
              </div>
            </div>
          )}

          {/* Success State */}
          {submissionStatus === "success" && (
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
                <CheckCircle2 className="h-10 w-10 text-primary" />
              </div>
              <DialogHeader className="items-center text-center">
                <DialogTitle className="text-xl">Ballot Submitted!</DialogTitle>
                <DialogDescription className="text-center">
                  Your vote has been securely recorded. Thank you for participating in this election.
                </DialogDescription>
              </DialogHeader>
              <p className="text-xs text-muted-foreground animate-pulse">
                Redirecting you shortly...
              </p>
            </div>
          )}

          {/* Error State */}
          {submissionStatus === "error" && (
            <div className="flex flex-col items-center gap-6 py-4">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-destructive/10">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
              <DialogHeader className="items-center text-center">
                <DialogTitle className="text-xl">Submission Failed</DialogTitle>
                <DialogDescription className="text-center">
                  {submissionError || "An unexpected error occurred while submitting your ballot."}
                </DialogDescription>
              </DialogHeader>
              <Button
                variant="outline"
                onClick={handleRetry}
                className="w-full"
              >
                Close & Try Again
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
