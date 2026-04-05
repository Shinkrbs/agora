"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrganizationPaymentRowData } from "../_types/payment-types";
import { OrganizationPaymentsTable } from "./OrganizationPaymentsTable";
import { ElectionsPaymentsTable } from "./ElectionsPaymentsTable";

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
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Payments Management
          </h1>
          <p className="text-muted-foreground">
            Review and verify payment transactions across the platform
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="organizations" className="w-full">
          <TabsList className="inline-grid grid-cols-2 bg-muted rounded-lg border border-border px-2">
            <TabsTrigger
              value="organizations"
              className="px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary"
            >
              Organizations
            </TabsTrigger>
            <TabsTrigger
              value="elections"
              className="px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary"
            >
              Elections
            </TabsTrigger>
          </TabsList>

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
