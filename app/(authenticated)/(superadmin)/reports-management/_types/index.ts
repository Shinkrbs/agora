export type Severity = "High" | "Medium" | "Low";

export interface BugReport {
  id: string;
  summary: string;
  severity: Severity;
  details: string;
  submittedBy: string;
  dateSubmitted: string;
}
