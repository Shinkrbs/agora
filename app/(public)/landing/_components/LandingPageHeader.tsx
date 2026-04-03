"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle"; // 1. Import your new component

export function LandingPageHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        
        {/* Left Side: Logo and Title */}
        <div className="flex items-center gap-3">
          <Image 
            src="/logo.svg" 
            alt="SOES Logo" 
            width={32} 
            height={32} 
            className="h-8 w-8 object-contain" 
            priority // Tells Next.js to load this instantly since it's above the fold
          />
          <span className="font-bold text-sm sm:text-base">
            Student Organization Election System
          </span>
        </div>

        {/* Right Side: Theme Toggle and CTA */}
        <div className="flex items-center gap-2 sm:gap-4 ">
          
          {/* 2. Drop in the reusable toggle! */}
          <ModeToggle />

          {/* Get Started Button */}
          <Button
            asChild
            className="bg-[#2e7d32] hover:bg-[#205e24] text-white"
          >
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
        
      </div>
    </header>
  );
}