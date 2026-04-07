"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ElectionLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
}

const tabs = [
  { label: "Dashboard", value: "dashboard", href: "dashboard" },
  { label: "Voters", value: "voter", href: "voter-management" },
  { label: "Partylists", value: "partylist", href: "partylist-management" },
  { label: "Candidates", value: "candidate", href: "candidate-management" },
  { label: "Reports", value: "reports", href: "reports" },
];

export default function ElectionLayout({ children, params }: ElectionLayoutProps) {
  const { id: electionId } = React.use(params);
  const pathname = usePathname();

  // Determine active tab based on current pathname
  const activeTab = tabs.find((tab) => pathname.includes(tab.href))?.value || "dashboard";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Election Details</h1>
        <p className="text-muted-foreground text-sm">
          Manage and view details of your election.
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} className="w-full">
        <TabsList className="w-full justify-between h-auto bg-transparent border-b border-border rounded-none p-0">
          {tabs.map((tab) => (
            <Link
              key={tab.value}
              href={`/election-session-management/election/${electionId}/${tab.href}`}
              className="flex-1"
            >
              <TabsTrigger
                value={tab.value}
                className="w-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-foreground"
              >
                {tab.label}
              </TabsTrigger>
            </Link>
          ))}
        </TabsList>
      </Tabs>

      {/* Content */}
      <div className="mt-6">{children}</div>
    </div>
  );
}
