import { Header } from "./components/LandingPageHeader"; // Updated to match your exact file name

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header /> 
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}