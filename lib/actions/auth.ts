"use server";
import { createClient } from "../supabase/server";
import { cookies, headers } from "next/headers";
import { loginSchema, signUpSchema } from "../schema/auth-schema";
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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session) {
    await supabase.auth.signOut();
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: validatedField.data.email,
    password: validatedField.data.password,
  });

  if (error) {
    console.error(error.message);
    return { error: error.message };
  }

  redirect("/(authenticated)/dashboard"); 
}

export async function signUpUser(prevState: any, formData: FormData) {
  const validatedField = signUpSchema.safeParse({
    first_name: formData.get("first-name"),
    middle_name: formData.get("middle-name"),
    last_name: formData.get("last-name"),
    suffix: formData.get("suffix"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm-password"),
  });

  if (!validatedField.success) {
    return {
      errors: validatedField.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient(await cookies());
  const headersList = await headers();
  const origin =
    headersList.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const emailRedirectTo = new URL("/login", origin).toString();

  const { error } = await supabase.auth.signUp({
    email: validatedField.data.email,
    password: validatedField.data.password,
    options: {
      emailRedirectTo: emailRedirectTo,
      data: {
        first_name: validatedField.data.first_name,
        middle_name: validatedField.data.middle_name,
        last_name: validatedField.data.last_name,
        suffix: validatedField.data.suffix,
        username: validatedField.data.username,
      },
    },
  });

  if (error) {
    console.error(error.message);
    return { error: error.message };
  }

  redirect("/confirm-email");
}
