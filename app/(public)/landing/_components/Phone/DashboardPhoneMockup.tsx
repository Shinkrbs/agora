import Tilt from "react-parallax-tilt";
import { BarChart2, Users, LaptopMinimalCheck } from "lucide-react";

export function DashboardPhoneMockup() {
  return (
    <div className="relative flex justify-center">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/60 blur-[80px]"></div>

      {/* Tilt Wrapper */}
      <Tilt
        tiltReverse={true}
        tiltMaxAngleX={5}
        tiltMaxAngleY={5}
        transitionSpeed={1500}
        className="relative inline-block"
      >
        {/* Phone container */}
        <div className="w-75 overflow-hidden rounded-[2.5rem] border-8 border-border bg-card shadow-2xl">
          <div className="flex h-135 w-full flex-col rounded-[1.8rem] bg-primary p-6 text-primary-foreground">
            <h3 className="mb-6 text-lg font-semibold">Election Dashboard</h3>
            <div className="flex-1 space-y-4">
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
