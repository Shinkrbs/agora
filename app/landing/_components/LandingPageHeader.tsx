"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function LandingPageHeader() {
  // 1. Pull in resolvedTheme
  const { setTheme, resolvedTheme } = useTheme();
  
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
          
          <Button 
            variant="ghost" 
            size="icon" 
            // 2. Use resolvedTheme here to fix the toggle math!
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="relative rounded-full"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          
          <Button>
            Get Started
          </Button>
        </div>
        
      </div>
    </header>
  );
}