"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export default function ElectionLayout({
  children,
  params,
}: ElectionLayoutProps) {
  const { id: electionId } = React.use(params);
  const pathname = usePathname();
  const router = useRouter();

  // Determine active tab based on current pathname
  const activeTab =
    tabs.find((tab) => pathname.includes(tab.href))?.value || "dashboard";
  const activeTabConfig =
    tabs.find((tab) => tab.value === activeTab) ?? tabs[0];

  const handleTabChange = (value: string) => {
    const selectedTab = tabs.find((tab) => tab.value === value);
    if (!selectedTab) return;
    router.push(
      `/election-session-management/election/${electionId}/${selectedTab.href}`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <NextLink
          href="/election-session-management"
          className="inline-flex w-fit pb-3"
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Election Sessions
          </Button>
        </NextLink>
        <h1 className="text-3xl font-bold text-foreground">Election Details</h1>
        <p className="text-muted-foreground text-sm">
          Manage and view details of your election.
        </p>
      </div>

      {/* Tabs */}
      <div className="w-full">
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between rounded-xl border-border/70"
              >
                <span>{activeTabConfig.label}</span>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-(--radix-dropdown-menu-trigger-width)"
            >
              {tabs.map((tab) => (
                <DropdownMenuItem key={tab.value} asChild>
                  <NextLink
                    href={`/election-session-management/election/${electionId}/${tab.href}`}
                    className="w-full"
                  >
                    {tab.label}
                  </NextLink>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="hidden md:block">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="w-full h-auto justify-start gap-1 rounded-xl border border-border/50 bg-muted/50 p-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-lg border-0 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-border/60"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      <div className="mt-6">{children}</div>
    </div>
  );
}
