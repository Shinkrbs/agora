import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Shield, CheckSquare, Eye, Star, Zap, Bell, Globe,
  BarChart2, Users, Archive, ShieldCheck, UserCheck, BarChart3, Smartphone, LaptopMinimalCheck
} from "lucide-react";

import {LandingPageHeader } from "./components/LandingPageHeader";
import LandingPageFooter from "./components/LandingPageFooter";
import { LandingCard } from "./components/LandingCard";

// Data arrays
const whySoesFeatures = [
  { icon: Zap, title: "Easy To Use", description: "Intuitive interface that makes managing elections simple for administrators and voting effortless for students." },
  { icon: Bell, title: "Real-Time Updates", description: "Live notifications and instant updates on election progress, vote counts, and participation rates." },
  { icon: Globe, title: "Multi-Session Support", description: "Manage multiple elections simultaneously with session-specific candidates, voters, and configurations." },
];

const capabilities = [
  { icon: ShieldCheck, title: "Secure Authentication", description: "One-time voting codes ensure security and anonymity" },
  { icon: Users, title: "Candidate Management", description: "Add candidates with photos, partylists, and details" },
  { icon: UserCheck, title: "Voter Management", description: "Manage voter lists per election session" },
  { icon: BarChart3, title: "Live Analytics", description: "Real-time vote tracking and participation metrics" },
  { icon: Eye, title: "Public Results", description: "Transparent results accessible to everyone" },
  { icon: Smartphone, title: "Mobile Responsive", description: "Optimized for all devices and screen sizes" },
];

export default function HomePage() {
  return (
    // bg-background and text-foreground automatically handle light/dark mode!
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">

      <main className="flex-1 flex flex-col w-full">
        {/* ================= HERO SECTION ================= */}
        <section className="container mx-auto px-4 sm:px-8 pt-16 pb-16 lg:pt-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extraboldtracking-tight">
                All Your Elections In One Place
              </h1>
              {/* text-muted-foreground automatically adapts to a readable gray in both modes */}
              <p className="font-mono mt-6 text-lg text-muted-foreground">
                Streamline your student organization elections with a secure,
                transparent, and modern platform designed for administrators,
                voters, and public transparency.
              </p>
              
              {/* Default Shadcn Button uses your primary Green automatically! */}
              <Button size="lg" className="mt-8 px-8 py-6 text-base rounded-md font-semibold">
                Get Started
              </Button>

              <div className="mt-10 flex items-center gap-4">
                <div className="flex gap-2 text-primary bg-primary/10 px-3 py-2 rounded-md border border-primary/20">
                  <Shield className="h-5 w-5" />
                  <CheckSquare className="h-5 w-5" />
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex text-primary gap-1">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <span className="font-mono text-sm text-muted-foreground font-medium">
                    Secure & Transparent
                  </span>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              {/* Stretched the background glow to match the taller phone */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[500px] bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>
              
              {/* Added h-[600px] and flex flex-col to force the phone shape */}
              <div className="relative w-full max-w-[300px] h-[600px] flex flex-col bg-card text-card-foreground border-[8px] border-border rounded-[2.5rem] shadow-2xl p-4 overflow-hidden">
                
                {/* Top Header / App Bar */}
                <div className="flex justify-between items-center mb-6 pt-2">
                  <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                    <div className="w-4 h-4 bg-primary rounded-sm transform rotate-45"></div>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-muted"></div>
                </div>
                
                {/* Content Area - added flex-1 so it takes up the middle space */}
                <div className="space-y-4 flex-1">
                  <div className="border border-border p-3 rounded-xl flex gap-3 items-center shadow-sm">
                    <div className="w-10 h-10 bg-secondary rounded-lg"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-2.5 bg-muted rounded w-full"></div>
                      <div className="h-2.5 bg-muted-foreground/30 rounded w-2/3"></div>
                    </div>
                  </div>
                  
                  <div className="border border-primary/30 bg-primary/5 p-3 rounded-xl flex gap-3 items-center shadow-sm relative overflow-hidden">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
                      <CheckSquare className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="h-2.5 bg-muted rounded w-full"></div>
                      <div className="h-2.5 bg-muted-foreground/30 rounded w-2/3"></div>
                    </div>
                  </div>

                  {/* Added a third ghost item to fill the taller screen nicely */}
                  <div className="border border-border p-3 rounded-xl flex gap-3 items-center shadow-sm opacity-60">
                    <div className="w-10 h-10 bg-secondary rounded-lg"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-2.5 bg-muted rounded w-full"></div>
                      <div className="h-2.5 bg-muted-foreground/30 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>

                {/* Bottom Area - mt-auto pushes this to the bottom of the phone */}
                <div className="mt-auto pt-6 pb-2">
                  <div className="w-full py-4 bg-primary rounded-xl flex justify-center shadow-lg">
                    <div className="w-12 h-1.5 bg-primary-foreground/30 rounded-full"></div>
                  </div>
                  
                  {/* Phone Home Indicator Bar */}
                  <div className="w-24 h-1.5 bg-border rounded-full mx-auto mt-6"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= WHY SOES SECTION ================= */}
        <section className="w-full bg-secondary/30 py-20 border-t border-border">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Why SOES?
              </h2>
              <p className=" font-mono mt-4 text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                Built specifically for student organizations with everything you need
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {whySoesFeatures.map((feature, index) => (
                <LandingCard
                  key={index}
                  type="why-soes"
                  Icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================= ONBOARDING GUIDE SECTION ================= */}
        <section className="w-full py-20">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Get Started in Minutes
              </h2>
              <p className=" font-mono mt-4 text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                Simple steps to launch your first election
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div className="space-y-8">
                {["Set up your organization", "Create an election session", "Share voting links", "Monitor & publish results"].map((step, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded text-primary-foreground bg-primary flex items-center justify-center font-bold text-sm font-mono">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{step}</h3>
                      <p className=" font-mono mt-1 text-sm text-muted-foreground leading-relaxed">
                        {idx === 0 && "Configure your organization details, create position templates, and add your branding."}
                        {idx === 1 && "Set election dates, add candidates with photos, and upload your voter list."}
                        {idx === 2 && "Generate unique voting links and distribute them to your registered voters securely."}
                        {idx === 3 && "Track votes in real-time and publish transparent results for everyone to see."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="relative flex justify-center lg:justify-end">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>
                
                <div className="relative w-full max-w-[320px] bg-card border-[8px] border-border rounded-[2.5rem] shadow-2xl overflow-hidden">
                  <div className="bg-primary h-full w-full p-6 text-primary-foreground rounded-[1.8rem] flex flex-col">
                    <h3 className="font-semibold text-lg mb-6">Election Dashboard</h3>
                    <div className="space-y-4 flex-1">
                      <div className="bg-background/10 rounded-xl p-4 border border-background/20 shadow-sm backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm opacity-80">Total Votes</span>
                          <BarChart2 className="w-4 h-4" />
                        </div>
                        <div className="font-mono text-2xl font-bold">1,247</div>
                      </div>
                      <div className="bg-background/10 rounded-xl p-4 border border-background/20 shadow-sm backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm opacity-80">Participation</span>
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="font-mono text-2xl font-bold">82.3%</div>
                      </div>
                      <div className="bg-background/10 rounded-xl p-4 border border-background/20 shadow-sm backdrop-blur-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm opacity-80">Active Elections</span>
                          <LaptopMinimalCheck className="w-4 h-4" />
                        </div>
                        <div className="font-mono text-2xl font-bold">3</div>
                      </div>
                    </div>
                    <div className="mt-8 mb-2 flex justify-center">
                      <button className="bg-background text-foreground text-xs font-bold py-2.5 px-6 rounded-full hover:bg-secondary transition-colors w-3/4 shadow-sm">
                        View Full Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= DUAL CTA SECTION ================= */}
        <section className="w-full py-20 pb-32">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="bg-primary rounded-[2.5rem] p-10 md:p-16 text-center max-w-5xl mx-auto shadow-xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-6">
                Ready to modernize your elections?
              </h2>
              <p className="font-mono text-primary-foreground/80 mb-10 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
                Join student organizations using SOES for secure, transparent, and efficient elections.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button variant="secondary" size="lg" className="font-semibold px-8 py-6 rounded-xl text-base">
                  Setup Now
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary font-semibold px-8 py-6 rounded-xl text-base">
                  Vote Now
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}