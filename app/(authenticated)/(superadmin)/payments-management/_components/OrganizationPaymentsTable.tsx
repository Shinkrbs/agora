"use client";

import { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PaymentRowData } from "@/types/database";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { ReceiptModal } from "./ReceiptModal";

interface OrganizationPaymentsTableProps {
  payments: PaymentRowData[];
  onVerify?: (paymentId: string) => void;
  onReject?: (paymentId: string) => void;
}

export function OrganizationPaymentsTable({
  payments,
  onVerify,
  onReject,
}: OrganizationPaymentsTableProps) {
  const [selectedReceipt, setSelectedReceipt] = useState<{
    url: string;
    orgName: string;
  } | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

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
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="text-foreground font-semibold">Organization</TableHead>
              <TableHead className="text-foreground font-semibold">Submitted By</TableHead>
              <TableHead className="text-foreground font-semibold">Date & Amount</TableHead>
              <TableHead className="text-foreground font-semibold">Receipt</TableHead>
              <TableHead className="text-foreground font-semibold">Status</TableHead>
              <TableHead className="text-foreground font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
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
                          onClick={() => onVerify?.(payment.id)}
                        >
                          Verify
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onReject?.(payment.id)}
                        >
                          Reject
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
