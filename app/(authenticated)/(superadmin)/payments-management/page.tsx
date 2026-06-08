"use client";

import { OrganizationPaymentRowData } from "./_types/payment-types";
import { ElectionPaymentRowData } from "./_types/election-payment-types";
import { PaymentsManagementClient } from "./_components";
import { useEffect, useState } from "react";
import { getOrganizationPayments } from "./_queries/organization-payments-query";
import { getElectionPayments } from "./_queries/election-payments-query";
import { toast } from "sonner";

export default function PaymentsManagementPage() {
  const [organizationPayments, setOrganizationPayments] = useState<
    OrganizationPaymentRowData[]
  >([]);
  const [electionPayments, setElectionPayments] = useState<
    ElectionPaymentRowData[]
  >([]);

  const fetchPayments = async () => {
    const orgResponse = await getOrganizationPayments();
    if (orgResponse.error) {
      console.error(
        "Failed to fetch organization payments:",
        orgResponse.error,
      );
      toast.error(
        "Failed to load organization payments. Please try again later.",
      );
    } else {
      setOrganizationPayments(orgResponse.data);
    }

    const electionResponse = await getElectionPayments();
    if (electionResponse.error) {
      console.error(
        "Failed to fetch election payments:",
        electionResponse.error,
      );
      toast.error("Failed to load election payments. Please try again later.");
    } else {
      setElectionPayments(electionResponse.data);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <PaymentsManagementClient
      organizationPayments={organizationPayments}
      electionPayments={electionPayments}
      onPaymentUpdated={fetchPayments}
    />
  );
}
