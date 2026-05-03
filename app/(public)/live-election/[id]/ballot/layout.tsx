export default function BallotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted flex flex-col">
      <header className="bg-background border-b border-border shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-lg md:text-xl font-bold text-foreground">
              🗳️ Official Ballot
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Focus Mode - Please vote carefully
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </div>
      </main>

      <footer className="bg-background border-t border-border">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center">
          <p className="text-xs text-muted-foreground">
            Your voting session is secure and private. This page has limited navigation to help you focus.
          </p>
        </div>
      </footer>
    </div>
  );
}
