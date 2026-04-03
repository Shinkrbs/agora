import { HeroPhoneMockup } from "./HeroPhoneMockup";
import { DashboardPhoneMockup } from "./DashboardPhoneMockup";
import { PhoneProps } from "@/types/phone"; // Adjust this path if your types folder is somewhere else!

export default function Phone({ phoneState }: PhoneProps) {
  return (
    <>
      {phoneState ? <HeroPhoneMockup /> : <DashboardPhoneMockup />}
    </>
  );
}