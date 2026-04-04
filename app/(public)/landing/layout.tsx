import type { Metadata } from "next";
import { ThemeProvider } from "@/components/themeprovider";
import { LandingPageHeader } from "./_components/LandingPageHeader";
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
        {/* 3. Wrap your entire app in the ThemeProvider */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      <LandingPageFooter />
    </div>
  );
}
