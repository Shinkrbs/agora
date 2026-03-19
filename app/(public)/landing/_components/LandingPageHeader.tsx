import { Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LandingPageHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Left Side: Logo and Title */}
        <div className="flex items-center gap-3">
          {/* Green Square Logo Placeholder */}
          <div className="h-8 w-8 rounded-md bg-[#2e7d32]" aria-hidden="true" />
          <span className="font-bold text-sm sm:text-base">
            Student Organization Election System
          </span>
        </div>

        {/* Right Side: Theme Toggle and CTA */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" aria-label="Toggle theme">
            <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          </Button>

          {/* Get Started Button */}
          <Button className="bg-[#2e7d32] hover:bg-[#205e24] text-white">
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
