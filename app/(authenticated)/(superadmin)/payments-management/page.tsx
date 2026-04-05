"use client";

import { PaymentRowData } from "@/types/database";
import { PaymentsManagementClient } from "./_components";

// Mock data for UI development
const MOCK_PAYMENTS: PaymentRowData[] = [
  {
    id: "1",
    amount: 5000,
    receipt_url: "/gcash.jpg",
    status: "pending",
    created_at: "2026-04-03T14:30:00Z",
    users: {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
    },
    organizations: {
      name: "Student Government Association",
      shorthand_name: "SGA",
    },
  },
  {
    id: "2",
    amount: 3500,
    receipt_url: "/gcash.jpg",
    status: "verified",
    created_at: "2026-04-02T10:15:00Z",
    users: {
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@example.com",
    },
    organizations: {
      name: "Engineering Society",
      shorthand_name: "ENGSOC",
    },
  },
  {
    id: "3",
    amount: 2000,
    receipt_url: "/gcash.jpg",
    status: "rejected",
    created_at: "2026-04-01T09:45:00Z",
    users: {
      first_name: "Michael",
      last_name: "Johnson",
      email: "michael.j@example.com",
    },
    organizations: {
      name: "Arts and Culture Club",
      shorthand_name: "ACC",
    },
  },
  {
    id: "4",
    amount: 7500,
    receipt_url: "/gcash.jpg",
    status: "pending",
    created_at: "2026-03-31T16:20:00Z",
    users: {
      first_name: "Sarah",
      last_name: "Williams",
      email: "sarah.w@example.com",
    },
    organizations: {
      name: "Business Club",
      shorthand_name: "BIZCLUB",
    },
  },
  {
    id: "5",
    amount: 4200,
    receipt_url: "/gcash.jpg",
    status: "verified",
    created_at: "2026-03-30T13:10:00Z",
    users: {
      first_name: "David",
      last_name: "Brown",
      email: "david.brown@example.com",
    },
    organizations: {
      name: "Sports Committee",
      shorthand_name: "SPORTS",
    },
  },
];

export default function PaymentsManagementPage() {
  const handleVerifyPayment = (paymentId: string) => {
    console.log("Verify payment:", paymentId);
    // TODO: Implement server action to verify payment
  };

  const handleRejectPayment = (paymentId: string) => {
    console.log("Reject payment:", paymentId);
    // TODO: Implement server action to reject payment
  };

  return (
    <PaymentsManagementClient
      organizationPayments={MOCK_PAYMENTS}
      onVerifyPayment={handleVerifyPayment}
      onRejectPayment={handleRejectPayment}
    />
  );
}
