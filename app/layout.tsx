import type { Metadata } from "next";
import { Arimo, Space_Mono } from "next/font/google";
import "./globals.css";

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
    <html lang="en">
      {/* Inject both font variables and set the default font to sans */}
      <body className={`${arimo.variable} ${spaceMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}