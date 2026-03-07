import { Button } from "@/components/ui/button";
import { Shield, CheckSquare, Eye, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="container mx-auto px-4 sm:px-8 pt-16 pb-16 lg:pt-32">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
        
        {/* Left Content Column */}
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

          {/* Trust Indicators */}
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

        {/* Right Content Column - CSS Phone Mockup */}
        <div className="relative flex justify-center lg:justify-end">
          {/* Green Glow Background Effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-green-400/20 blur-[80px] rounded-full pointer-events-none"></div>
          
          {/* Phone Hardware */}
          <div className="relative w-full max-w-[320px] bg-white dark:bg-gray-50 border-[8px] border-gray-50 dark:border-gray-200 rounded-[2.5rem] shadow-2xl p-4 overflow-hidden">
            
            {/* Phone Screen Header */}
            <div className="flex justify-between items-center mb-6 pt-2">
              <div className="w-8 h-8 rounded bg-[#2e7d32]/10 flex items-center justify-center">
                <div className="w-4 h-4 bg-[#2e7d32] rounded-sm transform rotate-45"></div>
              </div>
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-200"></div>
            </div>
            
            {/* Phone Screen List Items */}
            <div className="space-y-4">
              {/* Inactive Item */}
              <div className="border border-gray-100 p-3 rounded-xl flex gap-3 items-center shadow-sm">
                <div className="w-10 h-10 bg-green-50 rounded-lg"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-2.5 bg-gray-200 rounded w-full"></div>
                  <div className="h-2.5 bg-gray-100 rounded w-2/3"></div>
                </div>
              </div>
              
              {/* Active Item (Green) */}
              <div className="border border-[#2e7d32]/20 bg-green-50/50 p-3 rounded-xl flex gap-3 items-center shadow-sm">
                <div className="w-10 h-10 bg-[#2e7d32] rounded-lg flex items-center justify-center">
                  <CheckSquare className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="h-2.5 bg-gray-300 rounded w-full"></div>
                  <div className="h-2.5 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>

              {/* Inactive Item */}
              <div className="border border-gray-100 p-3 rounded-xl flex gap-3 items-center shadow-sm">
                <div className="w-10 h-10 bg-gray-50 rounded-lg"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-2.5 bg-gray-200 rounded w-full"></div>
                  <div className="h-2.5 bg-gray-100 rounded w-2/3"></div>
                </div>
              </div>
            </div>

            {/* Phone Screen Bottom Button */}
            <div className="mt-8 mb-2">
              <div className="w-full py-4 bg-[#2e7d32] rounded-xl flex justify-center">
                <div className="w-12 h-1.5 bg-white/30 rounded-full"></div>
              </div>
            </div>
            
          </div>
        </div>
        
      </div>
    </div>
  );
}