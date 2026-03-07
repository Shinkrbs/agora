import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { Suspense } from "react";

async function InstrumentsData() {
  const supabase = await createClient(await cookies());
  const { data: instruments } = await supabase.from("instruments").select();

  return <pre>{JSON.stringify(instruments, null, 2)}</pre>;
}

export default function Instruments() {
  return (
    <Suspense fallback={<div>Loading instruments...</div>}>
      <InstrumentsData />
    </Suspense>
  );
}
