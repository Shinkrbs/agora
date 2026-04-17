"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Users, MoreVertical } from "lucide-react";
import { PartylistWithCandidateCount } from "../_types/partylist-types";
import { cn } from "@/lib/utils";

interface PartylistCardProps {
  partylist: PartylistWithCandidateCount;
  onEdit?: (partylist: PartylistWithCandidateCount) => void;
  onDelete?: (partylistId: string) => void;
}

export function PartylistCard({
  partylist,
  onEdit,
  onDelete,
}: PartylistCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const hasCandidates = partylist.candidate_count > 0;

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      {/* Card Header */}
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Logo Avatar */}
          <Avatar className="h-12 w-12 rounded-md">
            <AvatarImage
              src={partylist.logo_url || undefined}
              alt={partylist.name}
            />
            <AvatarFallback className="rounded-md">
              {getInitials(partylist.name)}
            </AvatarFallback>
          </Avatar>

          {/* Text Block */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {partylist.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-muted-foreground">
                {partylist.shorthand_name}
              </span>
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(partylist)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete?.(partylist.id)}
              className="text-destructive"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="pb-4">
        <p
          className={cn(
            "text-sm line-clamp-2",
            partylist.description
              ? "text-muted-foreground"
              : "text-muted-foreground italic"
          )}
        >
          {partylist.description || "No description provided"}
        </p>
      </CardContent>

      {/* Card Footer */}
      <CardFooter className="border-t bg-muted/30 px-6 py-3">
        <div className="flex items-center gap-2">
          <Users
            className={cn(
              "h-4 w-4",
              hasCandidates ? "text-foreground" : "text-destructive"
            )}
          />
          <span
            className={cn(
              "text-sm font-medium",
              hasCandidates ? "text-foreground" : "text-destructive"
            )}
          >
            {partylist.candidate_count} Candidate
            {partylist.candidate_count !== 1 ? "s" : ""}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
