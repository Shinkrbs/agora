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
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 dark:bg-[#2e7d32]/20 mb-6">
        <Icon className="h-6 w-6 text-[#2e7d32]" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
};

// 2. The left-aligned card used in the "Everything You Need" section
const CapabilityCard = ({ Icon, title, description }: Omit<LandingCardProps, "type">) => {
  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow h-full">
      <div className="flex items-center gap-4 mb-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 dark:bg-[#2e7d32]/20">
          <Icon className="h-6 w-6 text-[#2e7d32]" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
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