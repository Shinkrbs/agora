import type { Metadata } from "next";
import { Arimo, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";

// Configure Arimo
const arimo = Arimo({
  subsets: ["latin"],
  variable: "--font-arimo",
});

// Configure Space Mono (requires weight specification)
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
    <html lang="en" suppressHydrationWarning>
      {/* Add this warning fix too */}
      <head />
      <body
        className={`${arimo.variable} ${spaceMono.variable} font-sans antialiased`}
      >
        <NextThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextTopLoader color="#61e267"/>
          {children}
        </NextThemeProvider>
      </body>
    </html>
  );
}
