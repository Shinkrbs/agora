"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrganizationPaymentRowData } from "../_types/payment-types";
import { OrganizationPaymentsTable } from "./OrganizationPaymentsTable";
import { ElectionsPaymentsTable } from "./ElectionsPaymentsTable";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PaymentsManagementClientProps {
  organizationPayments: OrganizationPaymentRowData[];
  onPaymentUpdated?: () => void;
  onVerifyPayment?: (paymentId: string) => void;
  onRejectPayment?: (paymentId: string) => void;
}

export function PaymentsManagementClient({
  organizationPayments,
  onPaymentUpdated,
}: PaymentsManagementClientProps) {
  const [activeTab, setActiveTab] = useState("organizations");
  const tabs: Array<{ value: string; label: string }> = [
    { value: "organizations", label: "Organizations" },
    { value: "elections", label: "Elections" },
  ];
  const activeTabConfig =
    tabs.find((tab) => tab.value === activeTab) ?? tabs[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-5 md:py-8">
          <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl">
            Payments Management
          </h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Review and verify payment transactions across the platform
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-5 md:py-8">
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 w-full justify-between rounded-xl text-sm"
              >
                <span>{activeTabConfig.label}</span>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-(--radix-dropdown-menu-trigger-width)"
            >
              {tabs.map(({ value, label }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => setActiveTab(value)}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="hidden md:block">
            <TabsList className="w-full h-auto justify-start gap-1 rounded-xl border border-border/50 bg-muted/50 p-1">
              {tabs.map(({ value, label }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="rounded-lg border-0 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-background/60 hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:ring-1 data-[state=active]:ring-border/60"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Organizations Tab */}
          <TabsContent value="organizations" className="mt-6">
            <OrganizationPaymentsTable
              payments={organizationPayments}
              onPaymentUpdated={onPaymentUpdated}
            />
          </TabsContent>

          {/* Elections Tab */}
          <TabsContent value="elections" className="mt-6">
            <ElectionsPaymentsTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
