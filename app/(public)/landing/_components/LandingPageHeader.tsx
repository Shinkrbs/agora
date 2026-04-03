"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle"; 

export function LandingPageHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        
        <div className="flex items-center gap-3">
          <Image 
            src="/logo.svg" 
            alt="SOES Logo" 
            width={32} 
            height={32} 
            className="h-8 w-8 object-contain" 
            priority 
          />
          <span className="font-bold text-sm sm:text-base">
            Student Organization Election System
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 ">
          
          <ModeToggle />

          <Button
            asChild
            className="bg-[#2e7d32] hover:bg-[#205e24] text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base"
          >
            <Link href="/login">Log in</Link>
          </Button>
        </div>
        
      </div>
    </header>
  );
}