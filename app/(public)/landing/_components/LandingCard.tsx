import { LucideIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface LandingCardProps {
  Icon: LucideIcon;
  title: string;
  description: string;
  type?: "one" | "two";
}

const LandingCardOne = ({ Icon, title, description }: LandingCardProps) => {
  return (
    <Card className="h-60 border-border shadow-2xl/20 shadow-background transition-shadow hover:shadow-foreground">
      <CardHeader className="pb-4 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-900/10">
          <Icon className="h-8 w-8 text-green-800" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

const LandingCardTwo = ({ Icon, title, description }: LandingCardProps) => {
  return (
    <Card className="h-36 border-border shadow-2xl/20 shadow-background transition-shadow hover:shadow-foreground">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-900/10">
            <Icon className="h-6 w-6 text-green-800" />
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
        <CardDescription className="mt-2">{description}</CardDescription>
      </CardHeader>
    </Card>
  );
};

const LandingCard = ({
  Icon,
  title,
  description,
  type = "one",
}: LandingCardProps) => {
  return type === "one" ? (
    <LandingCardOne Icon={Icon} title={title} description={description} />
  ) : (
    <LandingCardTwo Icon={Icon} title={title} description={description} />
  );
};

export default LandingCard;
