import { BugReport } from "../_types/index";
const mockData: BugReport[] = [
  {
    id: "1",
    summary: "App version 10.12 crashes",
    severity: "High",
    details: "Welcome screen freezes and...",
    submittedBy: "alice (you)",
    dateSubmitted: "< 1 minute ago",
  },
  {
    id: "2",
    summary: "Passwordless login creates loop",
    severity: "High",
    details: "Sign in page routes back to...",
    submittedBy: "alice (you)",
    dateSubmitted: "< 1 minute ago",
  },
  {
    id: "3",
    summary: "Ingredients list hidden on small devices",
    severity: "Medium",
    details: "Doesn’t load if screen width is...",
    submittedBy: "alice (you)",
    dateSubmitted: "< 1 minute ago",
  },
];
export default mockData;
