"use client";

import { signUpUser } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useActionState } from "react";
import { Mail, Lock, User, AtSign, Badge } from "lucide-react";
import Image from "next/image";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, isPending] = useActionState(signUpUser, undefined);
  const errorMessage =
    state?.error || state?.errors?.email?.[0] || state?.errors?.password?.[0];

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-0 shadow-xl">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="flex justify-center mb-2">
            <Link href="/">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={60}
              height={60}
              className="w-14 h-14 md:w-16 md:h-16"
            />
            </Link>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold">
            Create Account
          </CardTitle>
          <CardDescription className="text-sm md:text-base px-2">
            Join Student Organization Election System
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="text-sm md:text-base font-semibold mb-1">
                  Personal Information
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Enter your name details
                </p>

                {/* Name Fields Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="first-name"
                      className="text-xs md:text-sm font-medium"
                    >
                      First Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="first-name"
                        type="text"
                        name="first-name"
                        placeholder="Juan"
                        required
                        className="pl-10 text-sm h-10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="last-name"
                      className="text-xs md:text-sm font-medium"
                    >
                      Last Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="last-name"
                        type="text"
                        name="last-name"
                        placeholder="Sultan"
                        required
                        className="pl-10 text-sm h-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="middle-name"
                      className="text-xs md:text-sm font-medium"
                    >
                      Middle Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="middle-name"
                        type="text"
                        name="middle-name"
                        placeholder="Magsaysay"
                        className="pl-10 text-sm h-10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="suffix"
                      className="text-xs md:text-sm font-medium"
                    >
                      Suffix
                    </Label>
                    <div className="relative">
                      <Badge className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="suffix"
                        type="text"
                        name="suffix"
                        placeholder="Jr."
                        className="pl-10 text-sm h-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm md:text-base font-semibold mb-1">
                  Account Details
                </h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Create your username and set a password
                </p>

                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="username"
                      className="text-xs md:text-sm font-medium"
                    >
                      Username
                    </Label>
                    <div className="relative">
                      <AtSign className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="username1234"
                        required
                        className="pl-10 text-sm h-10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="email"
                      className="text-xs md:text-sm font-medium"
                    >
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        placeholder="admin@university.edu"
                        required
                        className="pl-10 text-sm h-10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="password"
                      className="text-xs md:text-sm font-medium"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        required
                        className="pl-10 text-sm h-10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="confirm-password"
                      className="text-xs md:text-sm font-medium"
                    >
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type="password"
                        name="confirm-password"
                        placeholder="Confirm your password"
                        required
                        className="pl-10 text-sm h-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="font-medium">Error</p>
                  <p className="text-xs mt-1">{errorMessage}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-800 text-white font-medium h-11 mt-2"
                disabled={isPending}
              >
                {isPending ? "Creating account..." : "Sign up"}
              </Button>
            </div>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link
                href="/login"
                className="text-green-700 hover:text-green-800 font-semibold underline underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
export default SignUpForm;
