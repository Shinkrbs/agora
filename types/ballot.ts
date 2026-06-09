export interface BallotData {
  electionId: string;
  positions: Array<{
    id: string;
    name: string;
    seatCount: number;
    candidates: Array<{
      id: string;
      firstName: string;
      lastName: string;
      partyName: string | null;
      imageUrl: string | null;
    }>;
  }>;
}
