import { ElectionStatus, PaymentStatus } from "@/types/database";

export interface MockElectionData {
  title: string;
  startDate: string | null;
  endDate: string | null;
  status: ElectionStatus;
  paymentStatus: PaymentStatus;
  isSetupComplete: boolean;
}

export const mockElectionData: MockElectionData = {
  title: "Presidential Election 2026",
  startDate: "2026-05-15",
  endDate: "2026-05-16",
  status: "active",
  paymentStatus: "verified",
  isSetupComplete: true,
};

export const mockElectionDataDraft: MockElectionData = {
  title: "Local Council Election",
  startDate: null,
  endDate: null,
  status: "draft",
  paymentStatus: "unpaid",
  isSetupComplete: false,
};

export const mockElectionDataPending: MockElectionData = {
  title: "Regional Board Election",
  startDate: "2026-06-01",
  endDate: "2026-06-02",
  status: "active",
  paymentStatus: "pending",
  isSetupComplete: true,
};

export const mockElectionDataCompleted: MockElectionData = {
  title: "Municipal Election 2025",
  startDate: "2025-11-10",
  endDate: "2025-11-11",
  status: "completed",
  paymentStatus: "verified",
  isSetupComplete: true,
};
