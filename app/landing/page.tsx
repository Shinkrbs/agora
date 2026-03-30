import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Shield, CheckSquare, Eye, Star, Zap, Bell, Globe,
  ShieldCheck, UserCheck, BarChart3, Smartphone, Users 
} from "lucide-react";

import { LandingPageHeader } from "./_components/LandingPageHeader";
import LandingPageFooter from "./_components/LandingPageFooter";
import { LandingCard } from "./_components/LandingCard";

// Import your newly created mockups
import { HeroPhoneMockup, DashboardPhoneMockup } from "./_components/Phone";

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
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
      <main className="flex-1 flex flex-col w-full">
        
        {/* ================= HERO SECTION ================= */}
        <section className="container mx-auto px-4 sm:px-8 pt-16 pb-16 lg:pt-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                All Your Elections In One Place
              </h1>
              <p className="font-mono mt-6 text-lg text-muted-foreground">
                Streamline your student organization elections with a secure,
                transparent, and modern platform designed for administrators,
                voters, and public transparency.
              </p>
              
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

            {/* Replaced massive block of code with the extracted component */}
            <HeroPhoneMockup />
            
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

              {/* Replaced massive block of code with the extracted component */}
              <DashboardPhoneMockup />
              
            </div>
          </div>
        </section>

        {/* ================= CAPABILITIES SECTION ================= */}
        <section className="w-full bg-secondary/30 py-20 border-t border-border">
          <div className="container mx-auto px-4 sm:px-8">
            <div className="text-center mb-16">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Everything You Need
              </h2>
              <p className="font-mono mt-4 text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
                Comprehensive features for modern student elections
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {capabilities.map((capability, index) => (
                <LandingCard
                  key={index}
                  type="capability"
                  Icon={capability.icon}
                  title={capability.title}
                  description={capability.description}
                />
              ))}
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
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="bg-transparent text-white border-2 border-white/80 dark:border-black/30 hover:bg-white/10 dark:hover:bg-black/20 hover:text-white font-semibold px-8 py-6 rounded-xl text-base transition-colors"
                >
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