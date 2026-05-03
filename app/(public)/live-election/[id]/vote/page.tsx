import { LandingPageHeader } from "../../../landing/_components/LandingPageHeader";
import { VoteAuthForm } from "./_components/VoteAuthForm";

interface VoteAuthPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ id?: string }>;
}

export default async function VoteAuthPage({
  params,
  searchParams,
}: VoteAuthPageProps) {
  const { id: electionId } = await params;
  const { id: studentIdFromUrl } = await searchParams;

  return (
    <>
      <LandingPageHeader />
      <VoteAuthForm 
        electionId={electionId} 
        initialStudentId={studentIdFromUrl || ""}
      />
    </>
  );
}
