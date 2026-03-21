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
import { Mail, Lock } from "lucide-react";
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
        <CardHeader className="text-center space-y-2 pb-4">
          <div className="flex justify-center mb-1">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={60}
              height={60}
              className="w-12 h-12 md:w-16 md:h-16"
            />
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold">
            Welcome!
          </CardTitle>
          <CardDescription className="text-xs md:text-sm px-2">
            Sign up to Student Organization Election System
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <form action={formAction}>
            <div className="flex flex-col gap-4">
              <CardTitle className="text-sm md:text-base font-semibold text-center">
                Sign up to our platform
              </CardTitle>
              <CardDescription className="text-xs text-center text-muted-foreground">
                Fill up the form to sign up.
              </CardDescription>

              {/* User Info Fields */}
              <div className="grid gap-2">
                <Label
                  htmlFor="first-name"
                  className="text-xs md:text-sm font-medium"
                >
                  First Name
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
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
                  htmlFor="middle-name"
                  className="text-xs md:text-sm font-medium"
                >
                  Middle Name
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
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
                  htmlFor="last-name"
                  className="text-xs md:text-sm font-medium"
                >
                  Last Name
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
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

              <div className="grid gap-2">
                <Label
                  htmlFor="suffix"
                  className="text-xs md:text-sm font-medium"
                >
                  Suffix
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="suffix"
                    type="text"
                    name="suffix"
                    placeholder="Junior"
                    className="pl-10 text-sm h-10"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label
                  htmlFor="username"
                  className="text-xs md:text-sm font-medium"
                >
                  Username
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 md:top-3 h-4 w-4 text-muted-foreground" />
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

              {/* Email Field */}
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

              {/* Password Field */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-xs md:text-sm font-medium"
                  >
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs underline-offset-4 hover:underline text-muted-foreground"
                  >
                    Forgot password?
                  </Link>
                </div>
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

              {/* Confirm Password Field */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="confirm-password"
                    className="text-xs md:text-sm font-medium"
                  >
                    Confirm Password
                  </Label>
                </div>
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

              {errorMessage && (
                <div className="p-2 md:p-3 text-xs md:text-sm text-red-500 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  {errorMessage}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-green-700 hover:bg-green-800 text-white text-sm h-10"
                disabled={isPending}
              >
                {isPending ? "Signing up..." : "Sign up"}
              </Button>
            </div>

            <div className="mt-4 text-center text-xs md:text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="underline underline-offset-4 text-green-700 hover:text-green-800 font-medium"
              >
                Sign In
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
export default SignUpForm;
