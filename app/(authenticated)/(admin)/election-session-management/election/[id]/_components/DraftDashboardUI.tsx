"use client";

import React from "react";
import { ElectionHeaderData } from "../_types/election-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Lock } from "lucide-react";
import { LaunchPaymentModal } from "./index";

interface DraftDashboardUIProps {
  election: ElectionHeaderData;
}

export const DraftDashboardUI: React.FC<DraftDashboardUIProps> = ({ election }) => {
  const setupSteps = [
    election.startDate !== null && election.endDate !== null, 
    election.totalPositions > 0, 
    election.totalCandidates > 0, 
    election.totalVoters > 0, 
  ];

  const completedSteps = setupSteps.filter(Boolean).length;
  const completionPercentage = (completedSteps / 4) * 100;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="capitalize">
              {election.status}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Positions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{election.totalPositions}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Candidates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{election.totalCandidates}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Voters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{election.totalVoters}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Path to Launch</CardTitle>
          <CardDescription>Complete all setup steps to launch your election</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Setup Progress</span>
              <span className="text-sm text-muted-foreground">{completedSteps}/4 steps</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          <div className="space-y-3">
            <ChecklistItem
              title="Schedule"
              description="Set election start and end dates"
              isComplete={setupSteps[0]}
            />

            <ChecklistItem
              title="Positions"
              description="Create election positions"
              isComplete={setupSteps[1]}
            />

            <ChecklistItem
              title="Candidates"
              description="Add candidates to positions"
              isComplete={setupSteps[2]}
            />

            <ChecklistItem
              title="Electorate"
              description="Upload voter list"
              isComplete={setupSteps[3]}
            />
          </div>
        </CardContent>
      </Card>

      <Card className={!election.isSetupComplete ? "opacity-60" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {election.isSetupComplete ? (
              "Ready to Launch"
            ) : (
              <>
                <Lock className="h-5 w-5" />
                Complete Setup to Launch
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!election.isSetupComplete ? (
            <p className="text-sm text-muted-foreground">
              Complete all setup steps above to unlock the election launch.
            </p>
          ) : election.paymentStatus === "verified" ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Your payment has been verified. You&apos;re all set to launch the election!
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Setup is complete, but payment verification is pending. Please verify your payment to proceed.
            </p>
          )}
        </CardContent>
      </Card>

    </div>
  );
};

interface ChecklistItemProps {
  title: string;
  description: string;
  isComplete: boolean;
}

const ChecklistItem: React.FC<ChecklistItemProps> = ({ title, description, isComplete }) => {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-border p-4">
      <div className="mt-1">
        {isComplete ? (
          <CheckCircle className="h-5 w-5 text-green-600" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};
