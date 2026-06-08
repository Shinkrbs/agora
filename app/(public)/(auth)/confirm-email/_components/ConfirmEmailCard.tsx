import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ConfirmEmailCard() {
  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="space-y-4 pb-4 text-center">
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="SOES logo"
              width={64}
              height={64}
              className="h-14 w-14 md:h-16 md:w-16"
            />
          </Link>
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold md:text-3xl">
            Check your email
          </CardTitle>
          <CardDescription className="px-2 text-sm md:text-base">
            We&apos;ve sent a confirmation link to your email address. Confirm it to
            finish creating your SOES account.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
            If you do not see the message, check your spam or junk folder.
          </div>

          <Button asChild className="h-11 w-full bg-green-700 text-white hover:bg-green-800">
            <Link href="/login">Try to login</Link>
          </Button>

          <Button asChild variant="outline" className="h-11 w-full">
            <Link href="/">Back to homepage</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}