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
import { Check, Eye, XCircle } from "lucide-react";

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
    null,
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
    [onPaymentUpdated],
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
      <div className="rounded-xl border border-border bg-card p-10 text-center shadow-sm">
        <p className="text-muted-foreground">No payments found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Search and Filter Bar */}
        <div className="border-b border-border bg-muted/20 p-4 md:p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <PaymentSearchBar
              onSearchChange={setSearchQuery}
              placeholder="Search organization, contact, or email..."
            />
            <div className="flex items-center justify-between gap-3 md:justify-end">
              <PaymentStatusFilter
                selectedStatuses={selectedStatuses}
                onStatusChange={setSelectedStatuses}
              />
            </div>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Showing {filteredPayments.length} of {payments.length} payments
          </div>
        </div>

        {/* Table */}
        {filteredPayments.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-muted-foreground">
              No payments match your search or filter criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-3 p-3 md:hidden">
              {filteredPayments.map((payment) => (
                <article
                  key={payment.id}
                  className="rounded-lg border border-border bg-background p-3"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {payment.organizations.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {payment.organizations.shorthand_name}
                      </p>
                    </div>
                    <PaymentStatusBadge status={payment.status} />
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Submitted by
                      </p>
                      <p className="font-medium text-foreground">
                        {payment.users.first_name} {payment.users.last_name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {payment.users.email}
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Date</p>
                        <p className="text-xs text-foreground">
                          {formatDate(payment.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                          {formatCurrency(payment.amount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleViewReceipt(
                          payment.receipt_url,
                          payment.organizations.name,
                        )
                      }
                      className="rounded-md"
                    >
                      <Eye className="h-4 w-4" />
                      View Receipt
                    </Button>

                    {payment.status === "pending" ? (
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
                              : "rounded-md"
                          }
                        >
                          {processingPaymentId === payment.id ? (
                            <>
                              <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <Check className="h-4 w-4" />
                              Verify
                            </>
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
                              : "rounded-md"
                          }
                        >
                          {processingPaymentId === payment.id ? (
                            <>
                              <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                              Rejecting...
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4" />
                              Reject
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <span className="self-center text-xs text-muted-foreground">
                        No actions
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden md:block">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className="h-11 px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Organization
                    </TableHead>
                    <TableHead className="h-11 px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Submitted By
                    </TableHead>
                    <TableHead className="h-11 px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Date & Amount
                    </TableHead>
                    <TableHead className="h-11 px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Receipt
                    </TableHead>
                    <TableHead className="h-11 px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Status
                    </TableHead>
                    <TableHead className="h-11 px-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.map((payment) => (
                    <TableRow
                      key={payment.id}
                      className="border-b border-border/70 transition-colors hover:bg-muted/30"
                    >
                      {/* Organization */}
                      <TableCell className="px-4 py-3.5 font-medium">
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
                      <TableCell className="px-4 py-3.5">
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
                      <TableCell className="px-4 py-3.5">
                        <div className="space-y-1">
                          <p className="text-sm text-foreground">
                            {formatDate(payment.created_at)}
                          </p>
                          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(payment.amount)}
                          </p>
                        </div>
                      </TableCell>

                      {/* Receipt */}
                      <TableCell className="px-4 py-3.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleViewReceipt(
                              payment.receipt_url,
                              payment.organizations.name,
                            )
                          }
                          className="rounded-md"
                        >
                          <Eye className="h-4 w-4" />
                          View Receipt
                        </Button>
                      </TableCell>

                      {/* Status */}
                      <TableCell className="px-4 py-3.5">
                        <PaymentStatusBadge status={payment.status} />
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-4 py-3.5">
                        <div className="flex flex-wrap gap-2">
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
                                    : "rounded-md"
                                }
                              >
                                {processingPaymentId === payment.id ? (
                                  <>
                                    <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                                    Verifying...
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4" />
                                    Verify
                                  </>
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
                                    : "rounded-md"
                                }
                              >
                                {processingPaymentId === payment.id ? (
                                  <>
                                    <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                                    Rejecting...
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4" />
                                    Reject
                                  </>
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
            </div>
          </>
        )}
      </div>

      {isReceiptModalOpen && selectedReceipt && (
        <ReceiptModal
          receiptUrl={selectedReceipt.url}
          title={selectedReceipt.orgName}
          isOpen={isReceiptModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedReceipt(null);
            }
            setIsReceiptModalOpen(open);
          }}
        />
      )}
    </>
  );
}
