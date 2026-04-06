import { ElectionCardSummary } from "../_types/election-card-type";

export const dummyElections: ElectionCardSummary[] = [
  {
    id: "elec-001",
    title: "2024 Student Government Elections",
    status: "active",
    start_date: "2024-04-01T08:00:00Z",
    end_date: "2024-04-05T17:00:00Z",
    payment_status: "verified",
    turnout_percentage: 67.5,
  },
  {
    id: "elec-002",
    title: "Club Officer Elections",
    status: "scheduled",
    start_date: "2024-05-15T08:00:00Z",
    end_date: "2024-05-20T17:00:00Z",
    payment_status: "pending",
    turnout_percentage: null,
  },
  {
    id: "elec-003",
    title: "Board of Directors Election",
    status: "completed",
    start_date: "2024-03-01T08:00:00Z",
    end_date: "2024-03-10T17:00:00Z",
    payment_status: "verified",
    turnout_percentage: 89.2,
  },
  {
    id: "elec-004",
    title: "Department Head Selection",
    status: "draft",
    start_date: null,
    end_date: null,
    payment_status: "pending",
    turnout_percentage: null,
  },
  {
    id: "elec-005",
    title: "Annual General Meeting Vote",
    status: "completed",
    start_date: "2024-02-01T08:00:00Z",
    end_date: "2024-02-15T17:00:00Z",
    payment_status: "verified",
    turnout_percentage: 75.8,
  },
];
