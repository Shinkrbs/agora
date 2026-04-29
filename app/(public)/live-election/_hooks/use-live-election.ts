import { useState } from "react";
import {
  activeElections,
  electionStats,
  positions,
  allCandidates,
  partylists,
} from "../_data/mock-election-data";

export function useLiveElection() {
  // 1. State Management
  const [selectedElectionId, setSelectedElectionId] = useState<string>(
    activeElections.length > 0 ? activeElections[0].id : "",
  );

  // 2. Helper Function
  const getStatusText = (candidates: typeof allCandidates) => {
    if (candidates.length < 2) return undefined;
    const diff = Math.abs(candidates[0].percentage - candidates[1].percentage);
    return diff < 5 ? "Too close to call" : undefined;
  };

  // 3. Derived State Variables
  const currentElection =
    activeElections.find((e) => e.id === selectedElectionId) ||
    activeElections[0];
  const stats = currentElection ? electionStats[currentElection.id] : null;
  const electionPositions = currentElection
    ? positions.filter((p) => p.election_id === currentElection.id)
    : [];

  // 4. Return everything the UI needs
  return {
    selectedElectionId,
    setSelectedElectionId,
    currentElection,
    stats,
    electionPositions,
    getStatusText,
    hasActiveElections: activeElections && activeElections.length > 0,
    activeElections,
    allCandidates,
    partylists,
    electionStats,
  };
}
