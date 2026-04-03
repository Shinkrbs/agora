import { LucideIcon } from "lucide-react";

interface LandingCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  type: "why-soes" | "capability";
}

// 1. The centered card used in the "Why SOES?" section
const WhySoesCard = ({ Icon, title, description }: Omit<LandingCardProps, "type">) => {
  return (
    <div className="bg-card text-card-foreground border border-border rounded-2xl p-8 text-center h-full transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_40px_-10px] hover:shadow-primary/20">
      
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-6 transition-colors duration-300">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      
      <h3 className="text-lg font-semibold mb-3">
        {title}
      </h3>
      
      <p className="font-mono text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

// 2. The left-aligned card used in the "Capabilities" section
const CapabilityCard = ({ Icon, title, description }: Omit<LandingCardProps, "type">) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 h-full transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_0_40px_-10px] hover:shadow-primary/20">
      <div className="flex items-center gap-4 mb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          {title}
        </h3>
      </div>
      <p className="font-mono text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

// 3. The main exported component that acts as a switch
export const LandingCard = ({ Icon, title, description, type }: LandingCardProps) => {
  return (
    <>
      {type === "why-soes" ? (
        <WhySoesCard Icon={Icon} title={title} description={description} />
      ) : (
        <CapabilityCard Icon={Icon} title={title} description={description} />
      )}
    </>
  );
};