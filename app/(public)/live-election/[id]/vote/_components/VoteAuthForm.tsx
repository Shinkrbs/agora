"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot, 
} from "@/components/ui/input-otp";
import { authenticateVoter } from "../../_actions/vote-auth";
import { Loader2 } from "lucide-react";

interface VoteAuthFormProps {
  electionId: string;
  initialStudentId: string;
}

export function VoteAuthForm({
  electionId,
  initialStudentId,
}: VoteAuthFormProps) {
  const router = useRouter();
  const [studentId, setStudentId] = useState(initialStudentId);
  const [votingCode, setVotingCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await authenticateVoter(
        electionId,
        studentId,
        votingCode,
      );

      if (result.success) {
        router.push(`/live-election/${electionId}/ballot`);
      } else {
        setError(result.error || "Authentication failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Access Your Ballot</h1>
          <p className="text-muted-foreground">
            Enter your student ID and voting code to begin voting
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="student-id" className="font-medium">
              Student ID
            </Label>
            <Input
              id="student-id"
              type="text"
              placeholder="e.g., 2021-12345"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              disabled={isLoading}
              className="text-base"
              required
            />
            <p className="text-xs text-muted-foreground">
              Your unique student identification number
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="voting-code" className="font-medium">
              Voting Code
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              8-character code sent to your email (format: XXXX-XXXX)
            </p>
            <div className="flex justify-center">
              <InputOTP
                maxLength={8}
                value={votingCode}
                onChange={setVotingCode}
                disabled={isLoading}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                  <InputOTPSlot index={6} />
                  <InputOTPSlot index={7} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-sm font-medium text-destructive">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isLoading || !studentId || votingCode.length < 8}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Authenticating...
              </>
            ) : (
              "Continue to Ballot"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your session will expire in 1 hour for security purposes.
          </p>
        </form>
      </div>
    </div>
  );
}
