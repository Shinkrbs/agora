"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";

export default function LandingPageHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 h-20 w-full border-b px-4 py-5 transition-all duration-300 sm:px-8 md:px-20 ${
        scrolled
          ? "bg-background/80 shadow-md backdrop-blur-md"
          : "bg-background"
      }`}
    >
      <div className="flex h-full items-center justify-between">
        <Link href="/landing" className="flex items-center gap-2">
          <Image src="/logo.svg" height={50} width={50} alt="SOES logo" />
          <span className="text-lg font-bold text-foreground">SOES</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <ModeToggle />
          <Button
            asChild
            className="bg-green-700 font-bold text-white hover:bg-green-900"
          >
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" className="font-bold">
            <Link href="/login">Log In</Link>
          </Button>
        </div>

        <div className="flex items-center md:hidden">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMenuOpen((current) => !current)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {isMenuOpen ? (
        <div className="mt-4 flex flex-col gap-4 rounded-md border bg-background p-4 md:hidden">
          <Button
            asChild
            className="w-full bg-green-800 font-bold text-white hover:bg-green-900"
          >
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" className="w-full font-bold">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      ) : null}
    </header>
  );
}
