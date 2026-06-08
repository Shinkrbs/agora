"use client";

import Link from "next/link";

import BlurText from "@/components/BlurText";
import { Button } from "@/components/ui/button";
import Phone from "./_components/Phone";
import LandingCard from "./_components/LandingCard";
import {
  BarChart3,
  Bell,
  Eye,
  Globe,
  Shield,
  Smartphone,
  UserCheck,
  Users,
  Vote,
  Zap,
} from "lucide-react";

interface InformationProps {
  number: string;
  title: string;
  description: string;
}

const Information = ({ number, title, description }: InformationProps) => {
  return (
    <div className="flex gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-green-800 to-green-600 font-semibold text-white">
        {number}
      </div>
      <div>
        <h3 className="mb-2 font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <section className="px-4 pb-36 pt-16 sm:px-8 md:px-20">
          <div className="container mx-auto max-w-7xl">
            <div className="grid items-center gap-10 lg:grid-cols-2">
              <div>
                <div className="mb-6 leading-tight">
                  <h1 className="mb-6 text-4xl font-bold sm:text-5xl md:text-6xl">
                    <BlurText
                      text="All Your Elections In One Place."
                      delay={150}
                      animateBy="words"
                      direction="top"
                    />
                  </h1>

                  <p className="mb-8 max-w-3xl text-muted-foreground">
                    Streamline your student organizations elections with a
                    secure, transparent, and modern platform designed for
                    administrators, voters, and public transparency.
                  </p>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      asChild
                      className="h-10 w-44 bg-green-700 text-base font-bold text-white hover:bg-green-900"
                    >
                      <Link href="/signup">Get Started</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="h-10 gap-2 border-border font-bold"
                    >
                      <Link href="/live-election">
                        <span className="relative flex h-3 w-3">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                        </span>
                        <span>Live Election Updates</span>
                      </Link>
                    </Button>
                  </div>

                  <div className="mt-5 flex items-center gap-2">
                    <div className="flex items-center">
                      <div className="-space-x-2 flex">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-green-900/30">
                          <Shield className="h-4 w-4 text-foreground" />
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-green-900/30">
                          <Vote className="h-4 w-4 text-foreground" />
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-background bg-green-900/30">
                          <Eye className="h-4 w-4 text-foreground" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, index) => (
                          <div key={index} className="h-5 w-5 text-foreground">
                            ★
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Secure &amp; Transparent
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="mx-auto flex w-full justify-center lg:justify-center">
                  <Phone phoneState />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="h-auto w-full border-t border-border bg-secondary/30 px-4 py-10 pt-25 sm:px-8 sm:pb-20 sm:pt-10 md:px-20 md:pb-40">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 flex justify-center text-center text-xl font-bold md:text-3xl">
                <BlurText
                  text="Why SOES?"
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className="flex justify-center"
                />
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Built specifically for student organizations with everything you
                need
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <LandingCard
                Icon={Zap}
                title="Easy To Use"
                description="Intuitive interface that makes managing elections simple for administrators and voting effortless for students."
                type="one"
              />
              <LandingCard
                Icon={Bell}
                title="Real-Time Updates"
                description="Live notifications and instant updates on election progress, vote counts, and participation rates."
                type="one"
              />
              <LandingCard
                Icon={Globe}
                title="Multi-Session Support"
                description="Manage multiple elections simultaneously with session-specific candidates, voters, and configurations."
                type="one"
              />
            </div>
          </div>
        </section>

        <section className="h-auto w-full px-4 py-10 sm:px-8 md:px-20">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 flex justify-center text-center text-xl font-bold md:text-3xl">
                <BlurText
                  text="Get Started in Minutes"
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className="flex justify-center"
                />
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Simple steps to launch your first election
              </p>
            </div>

            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <Information
                  number="1"
                  title="Create an election session"
                  description="Configure your organization details, create position templates, and add your branding."
                />
                <Information
                  number="2"
                  title="Set up your organization"
                  description="Set election dates, add candidates with photos, and upload your voter list for the specific election."
                />
                <Information
                  number="3"
                  title="Share voting links"
                  description="Generate unique voting links and distribute them to your registered voters securely."
                />
                <Information
                  number="4"
                  title="Monitor & publish results"
                  description="Track votes in real-time and publish transparent results for everyone to see."
                />
              </div>

              <div className="relative">
                <div className="mx-auto flex w-full justify-center">
                  <Phone phoneState={false} />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="h-auto w-full border-t border-border bg-secondary/30 px-4 py-10 sm:px-8 md:px-20 md:pb-40">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="mb-4 flex justify-center text-center text-xl font-bold md:text-3xl">
                <BlurText
                  text="Everything You Need"
                  delay={150}
                  animateBy="words"
                  direction="top"
                  className="flex justify-center"
                />
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Comprehensive features for modern student elections
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <LandingCard
                Icon={Shield}
                title="Secure Authentication"
                description="One-time voting codes ensure security and anonymity"
                type="two"
              />
              <LandingCard
                Icon={Users}
                title="Candidate Management"
                description="Add candidates with photos, partylists, and details"
                type="two"
              />
              <LandingCard
                Icon={UserCheck}
                title="Voter Management"
                description="Manage voter lists per election session"
                type="two"
              />
              <LandingCard
                Icon={BarChart3}
                title="Live Analytics"
                description="Real-time vote tracking and participation metrics"
                type="two"
              />
              <LandingCard
                Icon={Eye}
                title="Public Results"
                description="Transparent results accessible to everyone"
                type="two"
              />
              <LandingCard
                Icon={Smartphone}
                title="Mobile Responsive"
                description="Optimized for all devices and screen sizes"
                type="two"
              />
            </div>
          </div>
        </section>

        <section className="px-4 py-20 sm:px-8 md:px-20">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="rounded-3xl bg-linear-to-br from-green-600 to-green-800 p-12 text-primary-foreground">
              <h2 className="mb-5 text-xl font-bold">
                Ready to modernize your elections?
              </h2>
              <p className="mx-auto mb-8 max-w-2xl opacity-90">
                Join student organizations using SOES for secure, transparent,
                and efficient elections.
              </p>

              <div className="flex items-center justify-center gap-4">
                <Button
                  asChild
                  className="bg-background px-10 font-bold text-foreground hover:bg-background/70"
                >
                  <Link href="/signup">Setup Now</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/80 bg-transparent px-10 font-bold text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/live-election">Vote Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
