import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import type { ReportData } from "../_queries/get-report-data";

interface ElectionReportDocumentProps {
  data: ReportData;
  organizationName: string;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.5,
    color: "#000000",
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    paddingBottom: 15,
  },
  organizationName: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333333",
  },
  electionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000000",
  },
  headerInfo: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
  },
  headerColumn: {
    flex: 1,
  },
  headerLabel: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333333",
  },
  headerValue: {
    fontSize: 10,
    color: "#000000",
    marginBottom: 2,
  },
  turnoutBig: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 4,
  },
  positionBlock: {
    marginBottom: 20,
    pageBreakInside: "avoid",
  },
  positionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 6,
    marginBottom: 10,
  },
  positionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 3,
    color: "#000000",
  },
  positionSeats: {
    fontSize: 9,
    color: "#333333",
  },
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 6,
    marginBottom: 6,
    backgroundColor: "#F5F5F5",
    padding: 6,
  },
  tableHeaderCell: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#000000",
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#CCCCCC",
    paddingBottom: 4,
    paddingTop: 4,
    padding: 6,
  },
  tableRowWinner: {
    backgroundColor: "#F0F8F0",
  },
  rankCell: {
    width: "10%",
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
  },
  candidateCell: {
    width: "55%",
    fontSize: 10,
    color: "#000000",
  },
  candidateName: {
    fontWeight: "bold",
    marginBottom: 2,
  },
  partylist: {
    fontSize: 8,
    color: "#333333",
  },
  votesCell: {
    width: "15%",
    textAlign: "right",
    fontSize: 10,
    fontWeight: "bold",
    color: "#000000",
  },
  statusCell: {
    width: "20%",
    textAlign: "center",
    fontSize: 9,
    color: "#000000",
  },
  electedBadge: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#000000",
    padding: 2,
    border: "1px solid #000000",
  },
  noData: {
    fontSize: 9,
    fontStyle: "italic",
    color: "#666666",
  },
  footer: {
    marginTop: 40,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#000000",
    fontSize: 8,
    textAlign: "center",
    color: "#333333",
  },
});

export function ElectionReportDocument({
  data,
  organizationName,
}: ElectionReportDocumentProps) {
  const formattedDate = format(new Date(data.generated_at), "MMMM d, yyyy");
  const startDate = data.election.start_date
    ? format(new Date(data.election.start_date), "PPpp")
    : "Not specified";
  const endDate = data.election.end_date
    ? format(new Date(data.election.end_date), "PPpp")
    : "Not specified";

  return (
    <Document title={`${data.election.title} - Official Report`}>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.organizationName}>{organizationName}</Text>
          <Text style={styles.electionTitle}>{data.election.title}</Text>

          <View style={styles.headerInfo}>
            <View style={styles.headerColumn}>
              <Text style={styles.headerLabel}>Voting Period</Text>
              <Text style={styles.headerValue}>Start: {startDate}</Text>
              <Text style={styles.headerValue}>End: {endDate}</Text>
            </View>
            <View style={styles.headerColumn}>
              <Text style={styles.headerLabel}>Voter Turnout</Text>
              <Text style={styles.turnoutBig}>
                {data.voted_count} / {data.total_voters} (
                {data.turnout_percentage}%)
              </Text>
            </View>
          </View>
        </View>

        {/* Position Tallies */}
        {data.positions.map((position) => (
          <View key={position.position_id} style={styles.positionBlock} wrap={false}>
            {/* Position Header */}
            <View style={styles.positionHeader}>
              <Text style={styles.positionTitle}>{position.position_name}</Text>
              <Text style={styles.positionSeats}>
                Seats Available: {position.seat_count}
              </Text>
            </View>

            {/* Candidates Table */}
            {position.candidates.length > 0 ? (
              <>
                {/* Table Header */}
                <View style={styles.tableHeader}>
                  <Text
                    style={[styles.tableHeaderCell, { width: "10%" }]}
                  >
                    Rank
                  </Text>
                  <Text
                    style={[styles.tableHeaderCell, { width: "55%" }]}
                  >
                    Candidate Name
                  </Text>
                  <Text
                    style={[styles.tableHeaderCell, { width: "15%", textAlign: "right" }]}
                  >
                    Votes
                  </Text>
                  <Text
                    style={[styles.tableHeaderCell, { width: "20%", textAlign: "center" }]}
                  >
                    Status
                  </Text>
                </View>

                {/* Table Rows */}
                {position.candidates.map((candidate, index) => (
                  <View
                    key={candidate.id}
                    style={
                      candidate.isWinner
                        ? [styles.tableRow, styles.tableRowWinner]
                        : styles.tableRow
                    }
                  >
                    <Text style={styles.rankCell}>#{index + 1}</Text>
                    <View style={styles.candidateCell}>
                      <Text style={styles.candidateName}>
                        {candidate.first_name} {candidate.last_name}
                        {candidate.suffix && ` ${candidate.suffix}`}
                      </Text>
                      <Text style={styles.partylist}>
                        ({candidate.partylist_shorthand})
                      </Text>
                    </View>
                    <Text style={styles.votesCell}>
                      {candidate.vote_count.toLocaleString()}
                    </Text>
                    <Text style={styles.statusCell}>
                      {candidate.isWinner ? (
                        <Text style={styles.electedBadge}>[ELECTED]</Text>
                      ) : (
                        "-"
                      )}
                    </Text>
                  </View>
                ))}
              </>
            ) : (
              <Text style={styles.noData}>No candidates for this position.</Text>
            )}
          </View>
        ))}

        {/* Footer Section */}
        <View style={styles.footer}>
          <Text>
            Generated by Agora Election System securely on {formattedDate}.
          </Text>
          <Text>All votes were cast anonymously and tabulated with integrity.</Text>
        </View>
      </Page>
    </Document>
  );
}
