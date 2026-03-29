"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div>
      Oops! You are not authorized to access this page!{" "}
      <Button
        onClick={() => {
          router.back();
        }}
      >
        Go back.
      </Button>
    </div>
  );
}
