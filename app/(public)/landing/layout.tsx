import { LandingPageHeader } from "./_components/LandingPageHeader"; // Updated to match your exact file name
import LandingPageFooter from "./_components/LandingPageFooter";
import LandingPage from "./page";
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingPageHeader /> 
      <main className="flex-1">
        {children}
      </main>
      <LandingPageFooter />
    </div>
  );
}