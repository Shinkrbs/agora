import { Button } from "@/components/ui/button";
import { 
  Shield, CheckSquare, Eye, Star, Zap, Bell, Globe,
  BarChart2, Users, Archive, ShieldCheck, UserCheck, BarChart3, Smartphone
} from "lucide-react";
import { LandingCard } from "./components/LandingCard";

// Data arrays for cleaner rendering
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

export default function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      {/* ================= HERO SECTION ================= */}
      <section className="container mx-auto px-4 sm:px-8 pt-16 pb-16 lg:pt-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold italic text-gray-900 dark:text-white tracking-tight">
              All Your Elections In One Place
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
              Streamline your student organization elections with a secure,
              transparent, and modern platform designed for administrators,
              voters, and public transparency.
            </p>
            
            <Button className="mt-8 bg-[#2e7d32] hover:bg-[#205e24] text-white px-8 py-6 text-base rounded-md">
              Get Started
            </Button>

            <div className="mt-10 flex items-center gap-4">
              <div className="flex gap-2 text-[#2e7d32] bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-md border border-green-100 dark:border-green-900/30">
                <Shield className="h-5 w-5" />
                <CheckSquare className="h-5 w-5" />
                <Eye className="h-5 w-5" />
              </div>
              <div>
                <div className="flex text-[#2e7d32] gap-1">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Secure & Transparent
                </span>
              </div>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-green-400/20 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="relative w-full max-w-[320px] bg-white dark:bg-gray-50 border-[8px] border-gray-50 dark:border-gray-200 rounded-[2.5rem] shadow-2xl p-4 overflow-hidden">
              <div className="flex justify-between items-center mb-6 pt-2">
                <div className="w-8 h-8 rounded bg-[#2e7d32]/10 flex items-center justify-center">
                  <div className="w-4 h-4 bg-[#2e7d32] rounded-sm transform rotate-45"></div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-200"></div>
              </div>
              
              <div className="space-y-4">
                <div className="border border-gray-100 p-3 rounded-xl flex gap-3 items-center shadow-sm">
                  <div className="w-10 h-10 bg-green-50 rounded-lg"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-2.5 bg-gray-200 rounded w-full"></div>
                    <div className="h-2.5 bg-gray-100 rounded w-2/3"></div>
                  </div>
                </div>
                
                <div className="border border-[#2e7d32]/20 bg-green-50/50 p-3 rounded-xl flex gap-3 items-center shadow-sm">
                  <div className="w-10 h-10 bg-[#2e7d32] rounded-lg flex items-center justify-center">
                    <CheckSquare className="h-5 w-5 text-white" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="h-2.5 bg-gray-300 rounded w-full"></div>
                    <div className="h-2.5 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>

                <div className="border border-gray-100 p-3 rounded-xl flex gap-3 items-center shadow-sm">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-2.5 bg-gray-200 rounded w-full"></div>
                    <div className="h-2.5 bg-gray-100 rounded w-2/3"></div>
                  </div>
                </div>
              </div>

              <div className="mt-8 mb-2">
                <div className="w-full py-4 bg-[#2e7d32] rounded-xl flex justify-center">
                  <div className="w-12 h-1.5 bg-white/30 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY SOES SECTION ================= */}
      <section className="w-full bg-gray-50/50 dark:bg-gray-900/10 py-20 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Why SOES?
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Get Started in Minutes
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
              Simple steps to launch your first election
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded text-white bg-[#2e7d32] flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Set up your organization</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Configure your organization details, create position templates, and add your branding.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded text-white bg-[#2e7d32] flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create an election session</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Set election dates, add candidates with photos, and upload your voter list for the specific election.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded text-white bg-[#2e7d32] flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Share voting links</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Generate unique voting links and distribute them to your registered voters securely.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded text-white bg-[#2e7d32] flex items-center justify-center font-bold text-sm">4</div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Monitor & publish results</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Track votes in real-time and publish transparent results for everyone to see.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-green-400/20 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="relative w-full max-w-[320px] bg-white dark:bg-gray-50 border-[8px] border-gray-50 dark:border-gray-200 rounded-[2.5rem] shadow-2xl overflow-hidden">
                <div className="bg-[#2e7d32] h-full w-full p-6 text-white rounded-[1.8rem] flex flex-col">
                  <h3 className="font-semibold text-lg mb-6">Election Dashboard</h3>
                  <div className="space-y-4 flex-1">
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10 shadow-sm backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-green-50">Total Votes</span>
                        <BarChart2 className="w-4 h-4 text-green-100" />
                      </div>
                      <div className="text-2xl font-bold">1,247</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10 shadow-sm backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-green-50">Participation</span>
                        <Users className="w-4 h-4 text-green-100" />
                      </div>
                      <div className="text-2xl font-bold">82.3%</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4 border border-white/10 shadow-sm backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-green-50">Active Elections</span>
                        <Archive className="w-4 h-4 text-green-100" />
                      </div>
                      <div className="text-2xl font-bold">3</div>
                    </div>
                  </div>
                  <div className="mt-8 mb-2 flex justify-center">
                    <button className="bg-white text-[#2e7d32] text-xs font-bold py-2.5 px-6 rounded-full hover:bg-green-50 transition-colors w-3/4 shadow-sm">
                      View Full Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CAPABILITIES SECTION ================= */}
      <section className="w-full bg-gray-50/50 dark:bg-gray-900/10 py-20 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Everything You Need
            </h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
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
          <div className="bg-[#439b47] rounded-[2.5rem] p-10 md:p-16 text-center max-w-5xl mx-auto shadow-xl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to modernize your elections?
            </h2>
            <p className="text-green-50 mb-10 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Join student organizations using SOES for secure, transparent, and efficient elections.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-[#e8f5e9] hover:bg-[#c8e6c9] text-[#2e7d32] font-semibold px-8 py-6 rounded-xl text-base transition-colors">
                Setup Now
              </Button>
              <Button className="bg-white hover:bg-gray-100 text-gray-900 font-semibold px-8 py-6 rounded-xl text-base shadow-sm transition-colors">
                Vote Now
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}