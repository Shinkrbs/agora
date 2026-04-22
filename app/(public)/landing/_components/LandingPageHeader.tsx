"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";
import { Radio } from "lucide-react";
import { usePathname } from "next/navigation";

export function LandingPageHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
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

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Live Election Updates Button - Conditionally Rendered & Always Green */}
          {pathname !== "/live-election" && (
            <Button
              asChild
              className="bg-[#2e7d32] hover:bg-[#205e24] text-white flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base border-none shadow-sm"
            >
              <Link href="/live-election">
                {/* Red Pulsing Dot */}
                <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-red-500"></span>
                </span>

                {/* Icon */}
                <Radio className="w-4 h-4 text-white" />

                {/* Text */}
                <span className="hidden sm:inline font-semibold">
                  Live Election Updates
                </span>
                <span className="sm:hidden font-semibold">Live</span>
              </Link>
            </Button>
          )}

          <ModeToggle />

          <Button
            asChild
            className="bg-[#2e7d32] hover:bg-[#205e24] text-white px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-base border-none"
          >
            <Link href="/login">Log in</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
