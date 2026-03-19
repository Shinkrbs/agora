"use server";
import { createClient } from "../supabase/server";
import { cookies } from "next/headers";
import { loginSchema } from "../schema";
import { redirect } from "next/navigation";

export async function loginUser(prevState: any, formData: FormData) {
  const validatedField = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedField.success) {
    return {
      errors: validatedField.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient(await cookies());

  const { error } = await supabase.auth.signInWithPassword({
    email: validatedField.data.email,
    password: validatedField.data.password,
  });

  if (error) {
    console.error(error.message);
    return { error: error.message };
  }

  redirect("/authenticated/dashboard");
}
