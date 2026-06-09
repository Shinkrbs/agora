import type { Metadata } from "next";
import LandingPageHeader from "./_components/LandingPageHeader";
import LandingPageFooter from "./_components/LandingPageFooter";

export const metadata: Metadata = {
  title: "SOES",
  description: "Student Organization Election System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <LandingPageHeader />
      {children}
      <LandingPageFooter />
    </div>
  );
}
