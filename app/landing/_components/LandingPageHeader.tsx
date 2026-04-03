// app/landing/_components/LandingPageHeader.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ModeToggle"; // Import your new component!

export function LandingPageHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-primary" aria-hidden="true" />
          <span className="font-bold text-sm sm:text-base">
            Student Organization Election System
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Drop in your new reusable component right here! */}
          <ModeToggle />
          
          <Button>
            Get Started
          </Button>
        </div>
        
      </div>
    </header>
  );
}