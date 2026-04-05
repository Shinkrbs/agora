"use client";

import { useState, useCallback, useTransition, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { OrganizationPaymentRowData } from "../_types/payment-types";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { ReceiptModal } from "./ReceiptModal";
import { PaymentSearchBar } from "./PaymentSearchBar";
import { PaymentStatusFilter } from "./PaymentStatusFilter";
import { toast } from "sonner";
import updateOrganizationPayments from "../_actions/update-payments";
import { PaymentStatus } from "@/types/database";

interface OrganizationPaymentsTableProps {
  payments: OrganizationPaymentRowData[];
  onPaymentUpdated?: () => void;
}

export function OrganizationPaymentsTable({
  payments,
  onPaymentUpdated,
}: OrganizationPaymentsTableProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<{
    url: string;
    orgName: string;
  } | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<PaymentStatus[]>([
    "pending",
    "verified",
    "rejected",
  ]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      // Filter by status
      if (!selectedStatuses.includes(payment.status)) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesOrganization = payment.organizations.name
          .toLowerCase()
          .includes(query);
        const matchesShorthand = payment.organizations.shorthand_name
          .toLowerCase()
          .includes(query);
        const matchesFirstName = payment.users.first_name
          .toLowerCase()
          .includes(query);
        const matchesLastName = payment.users.last_name
          .toLowerCase()
          .includes(query);
        const matchesEmail = payment.users.email.toLowerCase().includes(query);

        return (
          matchesOrganization ||
          matchesShorthand ||
          matchesFirstName ||
          matchesLastName ||
          matchesEmail
        );
      }

      return true;
    });
  }, [payments, searchQuery, selectedStatuses]);

  const handlePaymentAction = useCallback(
    (paymentId: string, action: "verified" | "rejected") => {
      setProcessingPaymentId(paymentId);
      startTransition(async () => {
        const result = await updateOrganizationPayments(paymentId, action);
        if (result.success) {
          toast.success(result.message);
          onPaymentUpdated?.();
        } else {
          toast.error(result.message);
        }
        setProcessingPaymentId(null);
      });
    },
    [onPaymentUpdated]
  );

  const handleViewReceipt = useCallback((url: string, orgName: string) => {
    setSelectedReceipt({ url, orgName });
    setIsReceiptModalOpen(true);
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  if (payments.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card text-card-foreground shadow-sm p-8 text-center">
        <p className="text-muted-foreground">No payments found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {/* Search and Filter Bar */}
        <div className="border-b border-border bg-muted/30 p-4 space-y-4">
          <PaymentSearchBar
            onSearchChange={setSearchQuery}
            placeholder="Search by organization, contact name, or email..."
          />
          <PaymentStatusFilter
            selectedStatuses={selectedStatuses}
            onStatusChange={setSelectedStatuses}
          />
        </div>

        {/* Table */}
        {filteredPayments.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">
              No payments match your search or filter criteria.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent border-b border-border">
                <TableHead className="text-foreground font-semibold">
                  Organization
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  Submitted By
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  Date & Amount
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  Receipt
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  Status
                </TableHead>
                <TableHead className="text-foreground font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow
                  key={payment.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  {/* Organization */}
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">
                        {payment.organizations.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {payment.organizations.shorthand_name}
                      </p>
                    </div>
                  </TableCell>

                  {/* Submitted By */}
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {payment.users.first_name} {payment.users.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {payment.users.email}
                      </p>
                    </div>
                  </TableCell>

                  {/* Date & Amount */}
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-foreground">
                        {formatDate(payment.created_at)}
                      </p>
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(payment.amount)}
                      </p>
                    </div>
                  </TableCell>

                  {/* Receipt */}
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleViewReceipt(
                          payment.receipt_url,
                          payment.organizations.name
                        )
                      }
                    >
                      View Receipt
                    </Button>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <PaymentStatusBadge status={payment.status} />
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex gap-2">
                      {payment.status === "pending" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handlePaymentAction(payment.id, "verified")
                            }
                            disabled={isPending}
                            className={
                              processingPaymentId === payment.id
                                ? "opacity-50"
                                : ""
                            }
                          >
                            {processingPaymentId === payment.id ? (
                              <>
                                <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Verifying...
                              </>
                            ) : (
                              "Verify"
                            )}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handlePaymentAction(payment.id, "rejected")
                            }
                            disabled={isPending}
                            className={
                              processingPaymentId === payment.id
                                ? "opacity-50"
                                : ""
                            }
                          >
                            {processingPaymentId === payment.id ? (
                              <>
                                <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                Rejecting...
                              </>
                            ) : (
                              "Reject"
                            )}
                          </Button>
                        </>
                      )}
                      {payment.status !== "pending" && (
                        <span className="text-xs text-muted-foreground">
                          No actions
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {selectedReceipt && (
        <ReceiptModal
          receiptUrl={selectedReceipt.url}
          orgName={selectedReceipt.orgName}
          isOpen={isReceiptModalOpen}
          onOpenChange={setIsReceiptModalOpen}
        />
      )}
    </>
  );
}