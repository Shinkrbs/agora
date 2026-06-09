import { Loader2 } from "lucide-react";

interface OrganizationSwitchingLoaderProps {
  message?: string;
}

export function OrganizationSwitchingLoader({
  message = "Switching organization...",
}: OrganizationSwitchingLoaderProps) {
  return (
    <div className="fixed top-14 right-0 bottom-0 left-0 z-20 flex items-center justify-center bg-transparent backdrop-blur-sm md:left-(--sidebar-current-width)">
      <div className="mx-4 flex w-full max-w-sm items-center gap-2 rounded-lg bg-white px-4 py-3 shadow-lg sm:gap-3 sm:px-5 sm:py-4 dark:bg-slate-950">
        <Loader2 className="h-4 w-4 animate-spin text-green-800 sm:h-5 sm:w-5" />
        <p className="text-sm font-medium text-slate-900 sm:text-base dark:text-slate-50">
          {message}
        </p>
      </div>
    </div>
  );
}
