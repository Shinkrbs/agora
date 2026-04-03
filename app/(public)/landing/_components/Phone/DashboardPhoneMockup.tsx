import Tilt from "react-parallax-tilt";
import {BarChart2, Users, LaptopMinimalCheck } from "lucide-react";

export function DashboardPhoneMockup() {
  return (
    <div className="relative flex justify-center lg:justify-end">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>
      
      {/* Tilt Wrapper */}
      <Tilt 
        tiltReverse={true} 
        tiltMaxAngleX={5} 
        tiltMaxAngleY={5}
        transitionSpeed={1500}
        className="relative w-full max-w-[320px]"
      >
        {/* Phone container */}
        <div className="w-full bg-card border-[8px] border-border rounded-[2.5rem] shadow-2xl overflow-hidden">
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
      </Tilt>
    </div>
  );
// Add this interface and default export to the very bottom of your Phone.tsx file!
}