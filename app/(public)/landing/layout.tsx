import type { Metadata } from "next";
import { Arimo, Space_Mono } from "next/font/google";
// 1. Import the Theme Provider you created
import { ThemeProvider } from "@/components/ThemeProvider";
import { LandingPageHeader } from "./_components/LandingPageHeader";
import LandingPageFooter from "./_components/LandingPageFooter";

const arimo = Arimo({
  subsets: ["latin"],
  variable: "--font-arimo",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
});

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
      <body
        className={`${arimo.variable} ${spaceMono.variable} font-sans antialiased`}
      >
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
      </body>
      <LandingPageFooter />
    </div>
  );
}
