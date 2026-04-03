import Tilt from "react-parallax-tilt";
import { CheckSquare } from "lucide-react"; // plus any other icons you used
import Image from "next/image";

export function HeroPhoneMockup() {
  return (
    <div className="relative flex justify-center lg:justify-end">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[500px] bg-primary/20 blur-[80px] rounded-full pointer-events-none"></div>
      
      {/* Tilt Wrapper */}
      <Tilt 
        tiltReverse={true} 
        tiltMaxAngleX={5} 
        tiltMaxAngleY={5}
        transitionSpeed={1500}
        className="relative w-full max-w-[300px]"
      >
        {/* Phone container */}
        <div className="w-full h-[600px] flex flex-col bg-card text-card-foreground border-[8px] border-border rounded-[2.5rem] shadow-2xl p-4 overflow-hidden">
          
          {/* Top Header / App Bar */}
          <div className="flex justify-between items-center mb-6 pt-2">
            
            {/* --- LOGO UPDATED HERE --- */}
            {/* Replaced the green rotated square with your logo.svg */}
            <div className="flex items-center justify-center">
              <Image 
                src="/logo.svg" 
                alt="SOES App Logo" 
                width={32} 
                height={32} 
                className="h-8 w-8 object-contain"
              />
            </div>
            {/* ------------------------- */}

            <div className="w-8 h-8 rounded-lg bg-muted"></div>
          </div>
          
          {/* Content Area */}
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

            <div className="border border-border p-3 rounded-xl flex gap-3 items-center shadow-sm opacity-60">
              <div className="w-10 h-10 bg-secondary rounded-lg"></div>
              <div className="space-y-2 flex-1">
                <div className="h-2.5 bg-muted rounded w-full"></div>
                <div className="h-2.5 bg-muted-foreground/30 rounded w-1/2"></div>
              </div>
            </div>
          </div>

          {/* Bottom Area */}
          <div className="mt-auto pt-6 pb-2">
            <div className="w-full py-4 bg-primary rounded-xl flex justify-center shadow-lg">
              <div className="w-12 h-1.5 bg-primary-foreground/30 rounded-full"></div>
            </div>
            
            {/* Phone Home Indicator Bar */}
            <div className="w-24 h-1.5 bg-border rounded-full mx-auto mt-6"></div>
          </div>
        </div>
      </Tilt>
    </div>
  );
}