"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import type { BallotData } from "../_queries/get-ballot";

interface BallotPageProps {
  ballot: BallotData;
}

interface VoteState {
  [positionId: string]: string | string[];
}

export function BallotContent({ ballot }: BallotPageProps) {
  const [votes, setVotes] = useState<VoteState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedPosition, setExpandedPosition] = useState<string | null>(
    ballot.positions.length > 0 ? ballot.positions[0].id : null,
  );

  const handleRadioChange = (positionId: string, candidateId: string) => {
    setVotes((prev) => ({
      ...prev,
      [positionId]: candidateId,
    }));
  };

  const handleCheckboxChange = (
    positionId: string,
    candidateId: string,
    checked: boolean,
  ) => {
    setVotes((prev) => {
      const currentVotes = Array.isArray(prev[positionId])
        ? (prev[positionId] as string[])
        : [];

      if (checked) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Mock submission logic
      console.log("Ballot submitted with votes:", votes);
      
      // In a real implementation, this would call an action to save votes
      alert("Ballot submitted successfully! (Mock submission)");
    } catch (error) {
      console.error("Error submitting ballot:", error);
      alert("Error submitting ballot. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const allPositionsSelected = ballot.positions.every((position) => {
    const vote = votes[position.id];
    if (position.seatCount === 1) {
      return typeof vote === "string" && vote.length > 0;
    } else {
      return Array.isArray(vote) && vote.length > 0;
    }
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>Voting Instructions:</strong> Select one candidate per position (unless
          otherwise noted). Review your selections carefully before submitting.
        </p>
      </div>

      {/* Positions */}
      <div className="space-y-4">
        {ballot.positions.length > 0 ? (
          ballot.positions.map((position) => {
            const isExpanded = expandedPosition === position.id;
            const isMultiVote = position.seatCount > 1;
            const selectedVotes = votes[position.id];
            const selectedCount = Array.isArray(selectedVotes)
              ? selectedVotes.length
              : selectedVotes
                ? 1
                : 0;

            return (
              <Card key={position.id} className="shadow-sm">
                {/* Position Header - Clickable */}
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
                                  selectedCount > 0
                                    ? "font-medium text-green-600 dark:text-green-400"
                                    : "text-muted-foreground"
                                }
                              >
                                {selectedCount} selected
                              </span>
                            </span>
                          ) : (
                            <span>
                              Select one candidate •{" "}
                              <span
                                className={
                                  selectedCount > 0
                                    ? "font-medium text-green-600 dark:text-green-400"
                                    : "text-muted-foreground"
                                }
                              >
                                {selectedCount > 0 ? "Selected" : "Not selected"}
                              </span>
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                      )}
                    </div>
                  </CardHeader>
                </button>

                {/* Position Content */}
                {isExpanded && (
                  <CardContent className="space-y-4 border-t border-border pt-4">
                    {isMultiVote ? (
                      // Checkbox group for multi-vote
                      <div className="space-y-3">
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
                      // Radio group for single vote
                      <RadioGroup
                        value={(votes[position.id] as string) || ""}
                        onValueChange={(value) =>
                          handleRadioChange(position.id, value)
                        }
                      >
                        <div className="space-y-3">
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

      {/* Review Message */}
      {ballot.positions.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <p className="text-sm text-amber-900 dark:text-amber-100">
            <strong>Review your selections:</strong> Make sure you've selected a candidate for
            each position. You cannot change your vote after submission.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={!allPositionsSelected || isSubmitting}
          className="flex-1"
        >
          {isSubmitting ? "Submitting..." : "Review & Submit Ballot"}
        </Button>
      </div>
    </form>
  );
}
