"use client";

import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import Image from "next/image";

interface OrganizationCardProps {
  id: string;
  name: string;
  shorthandName: string;
  logoUrl?: string;
}

export function OrganizationCard({
  name,
  shorthandName,
  logoUrl,
}: OrganizationCardProps) {
  return (
    <Card className="relative p-6 h-full hover:shadow-md transition-shadow flex gap-4">
      {/* Circular Profile Image */}
      <div className="shrink-0">
        <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center">
          <Image
            src={logoUrl || "/logo.svg"}
            alt={`${name} logo`}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Ellipsis Menu Button */}
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="cursor-pointer">
              Change to {name}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Card Content */}
      <div className="flex-1 space-y-2 pr-8">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          {name}
        </h3>

        {shorthandName && (
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {shorthandName}
          </p>
        )}
      </div>
    </Card>
  );
}
