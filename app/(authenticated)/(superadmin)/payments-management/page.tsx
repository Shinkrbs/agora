"use client";

import { OrganizationPaymentRowData } from "./_types/payment-types";
import { PaymentsManagementClient } from "./_components";
import { useEffect, useState } from "react";
import { getOrganizationPayments } from "./_queries/organization-payments-query";
import { toast } from "sonner";



export default function PaymentsManagementPage() {
  const [organizationPayments, setOrganizationPayments] =
    useState<OrganizationPaymentRowData[]>([]);

  const fetchPayments = async () => {
    const response = await getOrganizationPayments();
    if (response.error) {
      console.error("Failed to fetch payments:", response.error);
      toast.error("Failed to load payments. Please try again later.");
    } else {
      setOrganizationPayments(response.data);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <PaymentsManagementClient
      organizationPayments={organizationPayments}
      onPaymentUpdated={fetchPayments}
    />
  );
}
